import { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
// import { useNavigate } from "react-router-dom";
import Interview from "./Interview";
import ReactPlayer from "react-player";
import { socket } from "@/socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [myStream, setMyStream] = useState(null);
  const [isPlayerOn, setIsPlayerOn] = useState(true);
  const socketRef = useRef(socket);

  const generateRoomId = (e) => {
    e.preventDefault();
    const Id = uuid().slice(0, 8);
    setRoomId(Id);
    console.log("Room ID is generated");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      console.error("Both fields are required");
      return;
    }
    socketRef.current.emit("is-room-full", { roomId });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  const previewCamera = () => {
    setIsPlayerOn(!isPlayerOn);
  };

  const getCam = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
  };
  useEffect(() => {
    getCam();
    const handleFullRoom = ({ message }) => {
      // toast.error("Room is full. Please try again later.");
      toast.warn(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    };
    socketRef.current.on("room-full", handleFullRoom);
    socketRef.current.on("room-not-full", () => {
      setJoined(true);
    });
    return () => {
      socketRef.current.off("room-full", handleFullRoom);
      socketRef.current.off("room-not-full");
    };
  }, []);

  if (!joined) {
    return (
      <>
        <div className=" flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-800">
          {myStream && isPlayerOn && (
            <ReactPlayer
              height="300px"
              width="600px"
              playing
              muted
              url={myStream}
              style={{ transform: "scaleX(-1)" }}
            />
          )}
          <button
            onClick={previewCamera}
            className=" px-4 py-2 mb-4 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600">
            {isPlayerOn ? "Turn Off Preview" : "Turn On Preview"}
          </button>
          <div className="w-full max-w-md p-8 bg-gray-700 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-white mb-6">
              Enter the ROOM ID
            </h2>
            <div className="mb-4">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-2 mb-3 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="ROOM ID"
                onKeyUp={handleInputEnter}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mb-3 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="USERNAME"
                onKeyUp={handleInputEnter}
              />
            </div>
            <button
              onClick={joinRoom}
              className="w-full px-4 py-2 mb-4 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600">
              JOIN
            </button>
            <p className="text-center text-white">
              Don&apos;t have a room ID? Create{" "}
              <span
                onClick={generateRoomId}
                className="text-blue-400 cursor-pointer hover:underline">
                New Room
              </span>
            </p>
          </div>
          <ToastContainer />
        </div>
      </>
    );
  }
  return <Interview roomId={roomId} username={username} myStream={myStream} />;
}

export default Home;
