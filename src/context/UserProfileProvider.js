import React, { useContext, useState } from "react";

const UserProfileContext = React.createContext();

export function UserProfileData() {
  return useContext(UserProfileContext);
}

export function UserProfileProvider({ children }) {
  const [userProfilePic, setUserProfilePic] = useState('');

  return (
    <UserProfileContext.Provider value={{ userProfilePic, setUserProfilePic }}>
      {children}
    </UserProfileContext.Provider>
  );
}
