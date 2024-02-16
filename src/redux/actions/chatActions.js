import axios from "axios";
import { actions } from "./index";
import config from "../../config";


const CHAT_GROUP_SUCCESS = "CHAT_GROUP_SUCCESS";
const CHAT_GROUP_FAILED = "CHAT_GROUP_FAILED";


export const settingsActions = {
  CHAT_GROUP_SUCCESS,
  CHAT_GROUP_FAILED,
};


// chat_group_list

export const chatGroupApi = (token) => dispatch => {
  // console.log("changePasswordApi request", request)
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
     // console.log("chatGroupApi response", data)
      //if (data.success) {
      resolve(data)
      // }
    }
    const onFailure = (error) => {
      //console.log("chat_group_list error:: ", error)
      reject(error.response)
    }

    axios.get(config.api.baseURL + "chat_group_list", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)
     
  })
}
export const chatGroupPostApi = (request, token) => dispatch => {
  // console.log("changePasswordApi request", request)
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
     // console.log("chatGroupApi response", data)
      //if (data.success) {
      resolve(data)
      // }
    }
    const onFailure = (error) => {
     // console.log("chat_group_list error:: ", error)
      reject(error.response)
    }

    axios.post(config.api.baseURL + "chat_group_list", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)
     
  })
}
export const BlockedChatUsersApi = (token) => dispatch => {
  // console.log("changePasswordApi request", request)
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      console.log("BlockedChatUsersApi response", data)
      //if (data.success) {
      resolve(data)
      // }
    }
    const onFailure = (error) => {
      console.log("block_user_list error:: ", error)
      reject(error.response)
    }

    axios.get(config.api.baseURL + "block_user_list", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)
     
  })
}
export const chatSingleMessageApi = (request,token) => dispatch => {
  //console.log("chatSingleMessageApi request", request)
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      //if (data.success) {
      resolve(data)
      // }
    }
    const onFailure = (error) => {
      console.log("chatSingleMessageApi error:: ", error.response.data)
      reject(error.response)
    }
    axios.post(config.api.baseURL + "chat_single_message", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)
     
  })
}
export const updateUnreadStatus = (request,token) => dispatch => {
  // console.log("changePasswordApi request", request)
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      //if (data.success) {
      resolve(data)
      // }
    }
    const onFailure = (error) => {
      console.log("update_unread_status error:: ", error.response.data)
      reject(error.response)
    }

    axios.post(config.api.baseURL + "update_unread_status", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)
     
  })
}


export const uploadMedia = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
     // if (data.success) {
        resolve(data)
    //  }
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "chat_media", request, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}

export const searchChatUserApi = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      resolve(data)
    }
    const onFailure = (error) => {
     // console.log("chat_group_list error:: ", error)
      reject(error.response)
    }

    axios.post(config.api.baseURL + "user_list", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)
     
  })
}

