/* eslint-disable no-unused-vars */
import CodeEditor from "@/components/code-editor";
import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Interview = ({ roomId, username, myStream }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const codeRef = useRef(null);
  const languageRef = useRef("python");
  const socketRef = useRef(socket);
  const messageInputRef = useRef(null);
  const [localStream, setLocalStream] = useState(myStream);
  const [remoteStream, setRemoteStream] = useState(null);
  const localPeerConnectionRef = useRef(null);
  const remotePeerConnectionRef = useRef(null);

  useEffect(() => {
    const handleJoined = async ({ clients, username: localUser, socketId }) => {
      if (localUser !== username) {
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

      // Set up local peer connection
      const localPeerConnection = new RTCPeerConnection();
      localStream
        .getTracks()
        .forEach((track) => localPeerConnection.addTrack(track, localStream));

      localPeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("candidate", {
            candidate: event.candidate,
            roomId,
          });
        }
      };

      localPeerConnection
        .createOffer()
        .then((offer) => {
          return localPeerConnection.setLocalDescription(offer);
        })
        .then(() => {
          socketRef.current.emit("offer", {
            offer: localPeerConnection.localDescription,
            roomId,
          });
        })
        .catch((error) => {
          console.error("Error creating offer:", error);
        });

      localPeerConnectionRef.current = localPeerConnection;

      // Set up remote peer connection
      const remotePeerConnection = new RTCPeerConnection();
      remotePeerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      remotePeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("candidate", {
            candidate: event.candidate,
            roomId,
          });
        }
      };

      remotePeerConnectionRef.current = remotePeerConnection;
    };

    const handleOffer = ({ offer }) => {
      const remotePeerConnection = remotePeerConnectionRef.current;
      remotePeerConnection
        .setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => {
          return remotePeerConnection.createAnswer();
        })
        .then((answer) => {
          return remotePeerConnection.setLocalDescription(answer);
        })
        .then(() => {
          socketRef.current.emit("answer", {
            answer: remotePeerConnection.localDescription,
            roomId,
          });
        })
        .catch((error) => {
          console.error("Error handling offer:", error);
        });
    };

    const handleAnswer = ({ answer }) => {
      const localPeerConnection = localPeerConnectionRef.current;
      localPeerConnection
        .setRemoteDescription(new RTCSessionDescription(answer))
        .catch((error) => {
          console.error("Error handling answer:", error);
        });
    };

    const handleCandidate = ({ candidate }) => {
      const peerConnection =
        localPeerConnectionRef.current || remotePeerConnectionRef.current;
      peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((error) => {
          console.error("Error adding received ICE candidate", error);
        });
    };

    const handleDisconnected = ({ socketId, username: disconnectedUser }) => {
      console.log("disconnected: ", disconnectedUser);
      const leftMessage = `${disconnectedUser} left the room.`;
      setMessages((prev) => [...prev, { message: leftMessage, mode: "leave" }]);
      setUsers((prev) => prev.filter((user) => user.socketId !== socketId));
    };

    const handleMessage = ({ message, username: sender }) => {
      setMessages((prev) => [
        ...prev,
        { username: sender, message, mode: "message" },
      ]);
    };

    socketRef.current.emit("join", { roomId, username });

    socketRef.current.on("joined", handleJoined);
    socketRef.current.on("offer", handleOffer);
    socketRef.current.on("answer", handleAnswer);
    socketRef.current.on("candidate", handleCandidate);
    socketRef.current.on("disconnected", handleDisconnected);
    socketRef.current.on("message", handleMessage);

    return () => {
      socketRef.current.off("joined", handleJoined);
      socketRef.current.off("offer", handleOffer);
      socketRef.current.off("answer", handleAnswer);
      socketRef.current.off("candidate", handleCandidate);
      socketRef.current.off("disconnected", handleDisconnected);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      socketRef.current.off("message", handleMessage);
    };
  }, [localStream, location.state, navigate, roomId, username]);

  const leaveRoom = async () => {
    socketRef.current.emit("leave-room", {
      roomId,
      username,
    });
    navigate("/about");
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
        username,
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
          }`}></div>
      </div>
      <div className="flex items-center gap-2">
        <p onClick={copyRoomId} className="text-white">
          Room ID: {roomId}
        </p>
        <button
          onClick={leaveRoom}
          className="px-2 py-1 text-white bg-red-500 rounded-md">
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
        <ReactPlayer
          height="300px"
          width="400px"
          playing
          muted
          url={localStream}
        />

        <ReactPlayer height="300px" width="400px" playing url={remoteStream} />

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
                }`}>
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

Interview.propTypes = {
  roomId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  myStream: PropTypes.object.isRequired,
};
export default Interview;
