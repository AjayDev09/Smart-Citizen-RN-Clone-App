import { io } from "socket.io-client";
import { IS_CLIENT_SERVER } from "../../../config/appConfig";
//const socket = io.connect("http://15.207.152.121:5001");
//const socket = io.connect("http://localhost:4001");

// const URL = IS_CLIENT_SERVER ? "http://95.216.217.81:5001" : "http://15.207.152.121:5001";
const URL = IS_CLIENT_SERVER ? 'http://52.204.28.140:5001' : "http://15.207.152.121:5001";
//172.31.29.81
//const socket = io(URL, { autoConnect: false });

var socket = io(URL, {
  // extraHeaders: {
  //   userid: global.user_id,
  //   usertype: global.user_type
  // }
});

//const socket = io("URL");

export default socket;
