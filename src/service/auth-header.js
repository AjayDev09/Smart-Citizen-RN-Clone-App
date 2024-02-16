//import { config } from "../../config/portal-config";
export const authHeader = () => {
  //const userToken = localStorage.getItem(config.authTokenKey);
  const userToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NDMzNTM4NTd9.ohGGh0TWNWqsZ0t-7GS9qoO2P3neND1NbN63nRYqKiU";

  if (userToken) {
    return { Authorization: "Bearer " + userToken };
  } else {
    return {};
  }
};

export const authUser = () => {
  const user = localStorage.getItem("authUser");

  if (user) {
    return JSON.parse(user);
  } else {
    return {};
  }
};
