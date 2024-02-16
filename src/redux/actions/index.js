import { loginActions } from "./loginActions";
import { settingsActions } from "./settingsActions";
import { couponActions } from "./couponActions";
import { feedActions } from "./feedActions";
import { blogActions } from "./blogActions";

export const actions = {
  login: loginActions,
  setting: settingsActions,
  coupon: couponActions,
  feed: feedActions,
  blog: blogActions
};
