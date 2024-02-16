import axios from "axios";
import { actions } from "./index";
import config from "../../config";

const LOGIN_REQUESTED = "LOGIN_REQUESTED";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAILED = "LOGIN_FAILED";
const IS_LOGGED_IN = "IS_LOGGED_IN";
const LOGOUT = "LOGOUT";
const PROFILE_SUCCESS = "PROFILE_SUCCESS";
const PROFILE_FAILED = "PROFILE_FAILED";
const REGISTER_SUCCESS = "REGISTER_SUCCESS";
const VERIFY_SUCCESS = "VERIFY_SUCCESS";
const REGISTER_FAILED = "REGISTER_FAILED";
const NOTIFICATION_LIST = "NOTIFICATION_LIST";
const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS";


export const loginActions = {
  LOGIN_REQUESTED,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  IS_LOGGED_IN,
  LOGOUT,
  PROFILE_SUCCESS,
  PROFILE_FAILED,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  VERIFY_SUCCESS,
  NOTIFICATION_LIST,
  FORGOT_PASSWORD_SUCCESS
};


export const loginApi = (request) => dispatch => {
  dispatch({
    type: actions.login.LOGIN_REQUESTED,
  });
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data;
      if (data.success) {
        console.log('response.data.is_verified_mobile_no', data.data.is_verified_mobile_no)
        dispatch({
          type: actions.login.LOGIN_SUCCESS,
          payload: data.data,
        });
        if (data.data.is_verified_mobile_no === 1) {
          dispatch({
            type: actions.login.IS_LOGGED_IN,
            //payload: data.data,
          });
        }
      } else {
        console.log("LOGIN_FAILED ")
        dispatch({
          type: actions.login.LOGIN_FAILED,
        });
      }
      resolve(data)

    };
    const onFailure = (error) => {
      console.log("action.error ", JSON.stringify(error))
      dispatch({
        type: actions.login.LOGIN_FAILED,
      });
      reject(error.response)

    };
    axios
      .post(config.api.baseURL + "login", request )
      .then(onSuccess)
      .catch(onFailure);
  })
};

export const socialLogin = (request) => dispatch => {
  dispatch({
    type: actions.login.LOGIN_REQUESTED,
  });
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      console.log('socialLogin response', response)
      const data = response.data;
      if (data.success) {
        console.log('response.data.is_verified_mobile_no', data.data.is_verified_mobile_no)
        dispatch({
          type: actions.login.LOGIN_SUCCESS,
          payload: data.data,
        });
        //if (data.data.is_verified_mobile_no === 1) {
        dispatch({
          type: actions.login.IS_LOGGED_IN,
          //payload: data.data,
        });
        // }
      } else {
        console.log("LOGIN_FAILED ")
        dispatch({
          type: actions.login.LOGIN_FAILED,
        });
      }
      resolve(data)

    };
    const onFailure = (error) => {
      console.log("action.error ", error)
      dispatch({
        type: actions.login.LOGIN_FAILED,
      });
      reject(error.response)

    };
    // axios
    //   .get("https://knp-tech.in/smartapp/api/web_dashboard")
    //   .then(onSuccess)
    //   .catch(onFailure);
    console.log('config.api.baseURL', config.api.baseURL)
    axios
      .post(config.api.baseURL + "social_login", request)
      .then(onSuccess)
      .catch(onFailure);
  })
};

export const forgotApi = (request) => dispatch => {
  dispatch({
    type: actions.login.LOGIN_REQUESTED,
  });
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      dispatch({
        type: actions.login.FORGOT_PASSWORD_SUCCESS,
      });
      const data = response.data;
      resolve(data)
    };
    const onFailure = (error) => {
      dispatch({
        type: actions.login.FORGOT_PASSWORD_SUCCESS,
      });
      console.log("action.error ", error)
      reject(error.response)

    };
    axios
      .post(config.api.baseURL + "forgot_password", request)
      .then(onSuccess)
      .catch(onFailure);
  })
};

export const resetPasswordApi = (request) => dispatch => {
  dispatch({
    type: actions.login.LOGIN_REQUESTED,
  });
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      dispatch({
        type: actions.login.FORGOT_PASSWORD_SUCCESS,
      });
      const data = response.data;
      resolve(data)
    };
    const onFailure = (error) => {
      dispatch({
        type: actions.login.FORGOT_PASSWORD_SUCCESS,
      });
      console.log("action.error ", error)
      reject(error.response)

    };
    axios
      .post(config.api.baseURL + "reset_password", request)
      .then(onSuccess)
      .catch(onFailure);
  })
};

export const registerApi = (request) => dispatch => {
  dispatch({
    type: actions.login.LOGIN_REQUESTED,
  });
  //console.log("register request:: ", request)
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      if (data.success) {
        dispatch({
          type: actions.login.REGISTER_SUCCESS,
          payload: data.data,
        });
        console.log("register success:: ", data)
      } else {
        dispatch({
          type: actions.login.LOGIN_FAILED,
        });
      }
      resolve(data)
    }
    const onFailure = (error) => {
      // console.log("register error:: ",  error.response)
      reject(error.response)
      dispatch({
        type: actions.login.LOGIN_FAILED,
      });
    }
    axios
      .post(config.api.baseURL + "register", request, {
        headers: {
          accept: 'application/json',
          'content-type': 'multipart/form-data',
        }
      })
      .then(onSuccess)
      .catch(onFailure);

  })
}

export const apiVerifyOtp = (request, token) => dispatch => {
    return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data;
      if (data.success) {

      }
      getProfile(token)
      resolve(data)
    };
    const onFailure = (error) => {
      reject(error.response)
    };

    axios
      .post(config.api.baseURL + "verify_phone_number", request, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);

  })
}

export const apiResendOtp = (token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data;
      console.log('data', data)
      resolve(data)
    };
    const onFailure = (error) => {
      reject(error.response)
    };

    axios
      .get(config.api.baseURL + "resend_otp", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);

  })
}



export const getProfile = (token) => dispatch => {
  //console.log("getProfile token >>>", token)
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      //console.log("getProfile response >>>", response.data.data)
      dispatch({
        type: actions.login.PROFILE_SUCCESS,
        payload: response.data.data,
      });
      resolve(response.data)
    };
    const onFailure = error => {
      if (error.toJSON().message === 'Network Error') {
        alert('no internet connection');
        dispatch({ type: RELOAD });
      } else {
        console.log("getProfile error >>>", error.response)
        dispatch({
          type: actions.login.PROFILE_FAILED,
          payload: "",
          error: error.response,
        });
      }

    };

    axios
      .get(config.api.baseURL + "get_profile", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);


  })


}

export const updateprofileApi = (request, token) => dispatch => {
  //console.log("updateprofileApi request", request)
  return new Promise((resolve, reject) => {
    //  
    const onSuccess = response => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      console.log("update_profile error:: ", error.response.data)
      reject(error.response)
    }

    axios
      .post(config.api.baseURL + "update_profile", request, {
        headers: {
          'Authorization': `Bearer ${token}`,
          accept: 'application/json',
          'content-type': 'multipart/form-data',
        }
      })
      .then(onSuccess)
      .catch(onFailure);
  })
}

export const notificationListApi = (token) => dispatch => {
  // console.log("notificationListApi request", token)
  return new Promise((resolve, reject) => {
    //  
    const onSuccess = response => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      console.log("notificationListApi error:: ", error.response.data)
      reject(error.response)
    }

    axios
      .get(config.api.baseURL + "notification_list", {
        headers: {
          'Authorization': `Bearer ${token}`,
          accept: 'application/json',
          'content-type': 'multipart/form-data',
        }
      })
      .then(onSuccess)
      .catch(onFailure);
  })
}
export const clearNotificationApi = (token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      console.log("clearNotificationApi error:: ", error.response.data)
      reject(error.response)
    }
    axios
      .get(config.api.baseURL + "clear_notification", {
        headers: {
          'Authorization': `Bearer ${token}`,
          accept: 'application/json',
          'content-type': 'multipart/form-data',
        }
      })
      .then(onSuccess)
      .catch(onFailure);
  })
}
export const logoutApi = (token) => dispatch => {
  //console.log("logoutApi request", request)
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      //if (data.success) {
      resolve(data)
      //}
    }
    const onFailure = (error) => {
      console.log("logoutApi error:: ", error.response.data)
      reject(error.response)
    }

    axios
      .get(config.api.baseURL + "logout", {
        headers: {
          'Authorization': `Bearer ${token}`,
          accept: 'application/json',
          'content-type': 'multipart/form-data',
        }
      })
      .then(onSuccess)
      .catch(onFailure);
  }) 
}


export const deleteAccountApi = (token) => dispatch => {
  //console.log("deleteAccountApi request", request)
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      console.log("deleteAccountApi error:: ", error.response.data)
      reject(error.response)
    }

    axios
      .get(config.api.baseURL + "delete_account", {
        headers: {
          'Authorization': `Bearer ${token}`,
          accept: 'application/json',
          'content-type': 'multipart/form-data',
        }
      })
      .then(onSuccess)
      .catch(onFailure);
  }) 
}

