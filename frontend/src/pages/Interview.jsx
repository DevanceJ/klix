import CodeEditor from "@/components/code-editor";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Interview = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [users, setUsers] = useState({});

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      socket.emit('set-nick', 'sam');
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onUsersRecieved(users) {
      setUsers(users);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('users', onUsersRecieved);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('users', onUsersRecieved);
    };
  }, []);

  return (
    <div className="flex items-center h-screen gap-[10px]">
      <div className="flex justify-center items-center mt-2.5 w-9">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></div>
      </div>
      <div className=" m-4 w-3/5">
        <CodeEditor/>
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
          {Object.keys(users).map((user) => (
            <div key={user} className="text-white">
              {users[user]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Interview;
