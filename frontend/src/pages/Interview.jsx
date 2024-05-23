import CodeEditor from "@/components/code-editor";
import { useEffect, useState, useRef } from "react";
import { socket } from "@/socket";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  useLocation,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";

const Interview = () => {
  const [isConnected, setIsConnected] = useState(false);
  // const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const codeRef = useRef(null);
  const languageRef = useRef("python");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!location.state?.username) {
      navigate("/");
      return;
    }
    const init = () => {
      socketRef.current = socket;
      socketRef.current.emit("join", {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          console.log(`${username} joined the room.`);
        }
        setIsConnected(true);
        setUsers(clients);
        console.log("joined: ", users);
        socketRef.current.emit("sync-code", {
          socketId,
          code: codeRef.current,
          language: languageRef.current,
        });
      });

      // socketRef.current.on("disconnect", ({ socketId, username }) => {
      //   console.log("disconnected: ", username);
      //   setUsers((prev) => prev.filter((user) => user.socketId !== socketId));
      // });
      socketRef.current.on("disconnected", ({ socketId, username }) => {
        console.log("disconnected: ", username);
        setUsers((prev) => {
          return prev.filter((user) => user.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      // socketRef.current.disconnect();
      socketRef.current.off("joined");
      // socketRef.current.off("disconnected");
    };
  }, []);
  if (!location.state) {
    return <Navigate to="/" />;
  }
  const leaveRoom = async () => {
    navigate("/");
  };
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      console.log(`roomIs is copied`);
    } catch (error) {
      console.log(error);
      console.error("unable to copy the room Id");
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
      <div className=" m-4 w-3/5">
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
      <div className="flex flex-col gap-[54px]">
        <div className="w-[450px]">
          <AspectRatio ratio={16 / 9}>
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="Image"
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </div>

        <div className="w-[450px]">
          <AspectRatio ratio={16 / 9}>
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="Image"
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </div>
        <div className=" h-[200px] border border-white rounded">
          <div className="h-full overflow-y-auto">
            {users.map((user) => (
              <div key={user.socketId} className="text-white">
                {user.username}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
