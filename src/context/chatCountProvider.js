import React, { useContext, useState } from "react";

const ChatCountContext = React.createContext();

export function UseChatCount() {
  return useContext(ChatCountContext);
}

export function ChatMessageCountProvider({ children }) {
  const [chatMessageCount, setChatMessageCount] = useState(0);

//   function createAuthUser(count) {
//     setAuthUser(user);
//   }

  return (
    <ChatCountContext.Provider value={{ chatMessageCount, setChatMessageCount }}>
      {children}
    </ChatCountContext.Provider>
  );
}
