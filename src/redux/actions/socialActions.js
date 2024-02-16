import axios from "axios";
import { actions } from "./index";
import config from "../../config";


const POST_SUCCESS = "POST_SUCCESS";
const POST_FAILED = "POST_FAILED";


export const socialActions = {
  POST_SUCCESS,
  POST_FAILED,
};

export const getSocialPostList = (request, token) => dispatch => {
  dispatch({
    type: socialActions.POST_SUCCESS
  })
  return new Promise((resolve, reject) => {

    const onSuccess = (response) => {
      const data = response.data
      dispatch({
        type: socialActions.POST_SUCCESS,
        payload: data
      })
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      dispatch({
        type: socialActions.POST_FAILED
      })
      reject(error.response)
    }
    axios.post(config.api.baseURL + "post_list", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}

export const addPost = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "add_post", request, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
export const postDetails = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      resolve(data)
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "post_details", request, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
export const deletePost = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      resolve(data)
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "delete_social_post", request, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}


export const updatePostLike = (request, token) => dispatch => {
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

    axios.post(config.api.baseURL + "post_like", request, {
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

export const searchPostCommentList = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      resolve(data)
    }
    const onFailure = (error) => {
      reject(error.response)
    }

    axios.post(config.api.baseURL + "post_comment_list", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
export const addPostComment = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      resolve(data)
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "add_post_comment", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
export const postProfile = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      resolve(data)
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "social_user_profile", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
export const socialUserConnect = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      resolve(data)
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "social_user_connection", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
export const socialPostSetting = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      resolve(data)
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "post_setting", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
export const socialAcceptRejectRequest = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      resolve(data)
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "social_user_accept_reject_request", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
export const socialPostReport = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      resolve(data)
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "post_report", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
export const socialPostBlockUser = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      resolve(data)
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "post_block_user", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}

export const blockUserList = (token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      console.log("get-card error:: ", error.response.data)
       reject(error.response)
    }
    axios
    .get(config.api.baseURL + "block_user_list",   {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(onSuccess)
    .catch(onFailure);
  })
}

export const socialUserConnList = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
     // console.log("get-card error:: ", error.response.data)
      reject(error.response)
    }
    axios
      .post(config.api.baseURL + "social_user_conn_list", request, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);
  })
}
export const socialPostLikeList = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
     // console.log("get-card error:: ", error.response.data)
      reject(error.response)
    }
    axios
      .post(config.api.baseURL + "post_like_list", request, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);
  })
}
export const socialPostView = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      console.log("data:: ", data)
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      console.log("get-card error:: ", error.response.data)
      reject(error.response)
    }
    axios
      .post(config.api.baseURL + "post_view", request, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);
  })
}
export const socialUserReport = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = response => {
      const data = response.data
      console.log("data:: ", data)
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      console.log("get-card error:: ", error.response.data)
      reject(error.response)
    }
    axios
      .post(config.api.baseURL + "user_report", request, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);
  })
}

