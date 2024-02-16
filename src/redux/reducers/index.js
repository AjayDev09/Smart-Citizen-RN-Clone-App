import { combineReducers } from "redux";
import authReducer from "./authReducer";
import userReducer from "./usersReducer";
import couponReducer from "./couponReducer";
import feedReducer from "./feedReducer";
import blogReducer from "./blogReducer";


export default combineReducers({
  auth: authReducer,
  user: userReducer,
  coupon: couponReducer,
  feed: feedReducer,
  blog: blogReducer,
});
