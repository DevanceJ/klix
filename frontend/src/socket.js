import { io } from "socket.io-client";

const URL = "localhost:3000/";

export const socket = io(URL); // autoConnect: false later
