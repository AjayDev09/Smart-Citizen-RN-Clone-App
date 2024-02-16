import React, { useContext, useState } from "react";

const NotificationCountContext = React.createContext();

export function UseNotificationCount() {
  return useContext(NotificationCountContext);
}

export function NotificationCountProvider({ children }) {
  const [notificationCount, setNotificationCount] = useState(0);

//   function createAuthUser(count) {
//     setAuthUser(user);
//   }

  return (
    <NotificationCountContext.Provider value={{ notificationCount, setNotificationCount }}>
      {children}
    </NotificationCountContext.Provider>
  );
}
