import { io } from "socket.io-client";

// const URL = "https://klix-rtgj.onrender.com/";
const URL = "localhost:3000/"

export const socket = io(URL, {
    secure: true,
    reconnection: true,
}); // autoConnect: false later