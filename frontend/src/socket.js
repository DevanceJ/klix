import { io } from "socket.io-client";

const URL = "https://klix-rtgj.onrender.com/";

export const socket = io(URL); // autoConnect: false later
