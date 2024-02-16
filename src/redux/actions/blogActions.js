import axios from "axios";
import config from "../../config";


const BLOGS_SUCCESS = "BLOGS_SUCCESS";
const BLOGS_FAILED = "BLOGS_FAILED";
const BLOGS_REQUESTED = "BLOGS_REQUESTED";


export const blogActions = {
  BLOGS_SUCCESS,
  BLOGS_FAILED,
  BLOGS_REQUESTED,
};


export const getAllBlogs = (request, token) => dispatch => {
  dispatch({
    type: blogActions.BLOGS_REQUESTED
  })
  return new Promise((resolve, reject) => {

    const onSuccess = (response) => {
      const data = response.data
      dispatch({
        type: blogActions.BLOGS_SUCCESS,
        payload: data
      })
      if (data.success) {
   //   console.log('getAllBlogs data', data)
        resolve(data)
      }
    }
    const onFailure = (error) => {
      dispatch({
        type: blogActions.BLOGS_FAILED
      })
      reject(error.response)
    }
    axios.post(config.api.baseURL + "blog_list", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })

}
export const getBlogs = (request, token) => dispatch => {
  dispatch({
    type: blogActions.BLOGS_REQUESTED
  })
  return new Promise((resolve, reject) => {

    const onSuccess = (response) => {
      const data = response.data
      dispatch({
        type: blogActions.BLOGS_SUCCESS,
        payload: data
      })
      if (data.success) {
   //   console.log('getAllBlogs data', data)
        resolve(data)
      }
    }
    const onFailure = (error) => {
      dispatch({
        type: blogActions.BLOGS_FAILED
      })
      reject(error.response)
    }
   axios.post(config.api.baseURL + "blog_list_pagination", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })

}

export const postBlogDetails = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "blog_details", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}

export const getBlogCommentList = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "blog_comment_list", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}

export const getBlogComments = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "blog_comment_list_pagination", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}



export const postBlogLike = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "blog_like", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}


export const postBlogComment = (request, token) => dispatch => {
  //console.log('postBlogComment request', request)
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "blog_comment", request, {
      headers: {
        'Authorization': `Bearer ${token}`,
        accept: 'application/json',
        'content-type': 'multipart/form-data',
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}

export const postBlogCommentLike = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "blog_comment_like", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
export const postBlogReport = (request, token) => dispatch => {
  console.log('request', request)
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.post(config.api.baseURL + "blog_report", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}