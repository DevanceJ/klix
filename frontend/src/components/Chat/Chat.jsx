import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";

const Chat = ({ messageInputRef, sendMessage, handleInputEnter, messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="border border-white rounded h-full overflow-y-auto p-2 flex-grow">
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
        <div ref={messagesEndRef} />
      </div>
      <div className="flex border-white gap-[20px]">
        <input
          ref={messageInputRef}
          onKeyUp={handleInputEnter}
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-1 rounded bg-black border border-white text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
        />
        <Button onClick={sendMessage} onKeyUp={handleInputEnter}>
          Send
        </Button>
      </div>
    </>
  );
};

Chat.propTypes = {
  messageInputRef: PropTypes.object.isRequired,
  sendMessage: PropTypes.func.isRequired,
  handleInputEnter: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired,
};

export default Chat;
