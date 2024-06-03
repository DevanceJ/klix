import CodeEditor from "@/components/code-editor";
import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  useLocation,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";

const Interview = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const [localStream, setLocalStream] = useState(null);
  // const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const codeRef = useRef(null);
  const languageRef = useRef("python");
  const socketRef = useRef(socket);
  const messageInputRef = useRef(null);

  useEffect(() => {
    if (!location.state?.username) {
      navigate("/");
      return;
    }

    const username = location.state?.username;

    const handleJoined = ({ clients, username, socketId }) => {
      if (username !== location.state?.username) {
        const joinedMessage = `${username} joined the room.`;
        setMessages((prev) => [
          ...prev,
          { message: joinedMessage, mode: "join" },
        ]);
      }
      setIsConnected(true);
      setUsers(clients);
      socketRef.current.emit("sync-code", {
        socketId,
        code: codeRef.current,
        language: languageRef.current,
      });
    };

    const handleDisconnected = ({ socketId, username }) => {
      console.log("disconnected: ", username);
      const leftMessage = `${username} left the room.`;
      setMessages((prev) => [...prev, { message: leftMessage, mode: "leave" }]);
      setUsers((prev) => prev.filter((user) => user.socketId !== socketId));
    };

    const handleMessage = ({ message, username }) => {
      setMessages((prev) => [...prev, { username, message, mode: "message" }]);
    };

    socketRef.current.emit("join", { roomId, username });

    socketRef.current.on("joined", handleJoined);
    socketRef.current.on("disconnected", handleDisconnected);
    socketRef.current.on("message", handleMessage);

    // Initialize media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error("Error accessing media devices.", error));

    return () => {
      socketRef.current.off("joined", handleJoined);
      socketRef.current.off("disconnected", handleDisconnected);
      socketRef.current.off("message", handleMessage);
    };
  }, [location.state, navigate, roomId]);

  useEffect(() => {
    if (!users) return;
    if (!localStream) return;
    socketRef.current.on("joined", {});
  }, [users, localStream]);
  if (!location.state) {
    return <Navigate to="/" />;
  }

  const leaveRoom = async () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    socketRef.current.emit("leave-room", {
      roomId,
      username: location.state?.username,
    });

    navigate("/");
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      console.log(`roomId is copied`);
    } catch (error) {
      console.error("Unable to copy the room Id", error);
    }
  };

  const sendMessage = () => {
    const message = messageInputRef.current.value;
    if (message.trim()) {
      socketRef.current.emit("message", {
        roomId,
        message,
        username: location.state?.username,
      });
      messageInputRef.current.value = "";
    }
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex items-center h-screen gap-[10px]">
      <div className="flex justify-center items-center mt-2.5">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
      </div>
      <div className="flex items-center gap-2">
        <p onClick={copyRoomId} className="text-white">
          Room ID: {roomId}
        </p>
        <button
          onClick={leaveRoom}
          className="px-2 py-1 text-white bg-red-500 rounded-md"
        >
          Leave
        </button>
      </div>
      <div className="m-4 w-3/5">
        <CodeEditor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
          onLanguageChange={(language) => {
            languageRef.current = language;
          }}
        />
      </div>
      <div className="h-full mt-8 flex flex-col gap-[50px]">
        <div className="w-[400px]">
          <AspectRatio ratio={16 / 9}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="rounded-md object-cover"
            ></video>
          </AspectRatio>
        </div>

        <div className="w-[400px]">
          <AspectRatio ratio={16 / 9}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="rounded-md object-cover"
            ></video>
          </AspectRatio>
        </div>

        <div className="h-[180px] border border-white rounded">
          <div className="h-full overflow-y-auto p-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={` ${
                  msg.mode === "join"
                    ? "text-green-500"
                    : msg.mode === "leave"
                    ? "text-red-500"
                    : "text-white"
                }`}
              >
                {msg.username ? (
                  <>
                    <strong>{msg.username}: </strong>
                    {msg.message}
                  </>
                ) : (
                  <>{msg.message}</>
                )}
              </div>
            ))}
          </div>
          <div className="flex mt-[15px] border-white gap-[20px]">
            <input
              ref={messageInputRef}
              onKeyUp={handleInputEnter}
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-1 rounded bg-black border border-white text-white"
            />
            <Button onClick={sendMessage} onKeyUp={handleInputEnter}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
