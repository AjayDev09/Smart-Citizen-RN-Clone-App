import React, { createContext, useContext, useMemo } from 'react';
import SocketIOClient, { io } from 'socket.io-client';
import { IS_CLIENT_SERVER } from '../config/appConfig';

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

const SocketProvider = ({ children }) => {

  // const URL = 'http://52.204.28.140:8002';
  // const URL = IS_CLIENT_SERVER ? "http://52.204.28.140:5001" : "http://15.207.152.121:5001";
  const URL = IS_CLIENT_SERVER ? 'http://52.204.28.140:5001' : "http://15.207.152.121:5001";

  const socket = io(URL, { transports: ['websocket'] },
  );
  // console.log('SocketProvider socket', socket)
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
