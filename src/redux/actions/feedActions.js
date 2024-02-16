import axios from "axios";
import config from "../../config";


const FEEDS_SUCCESS = "FEEDS_SUCCESS";
const FEEDS_FAILED = "FEEDS_FAILED";
const FEEDS_REQUESTED = "FEEDS_REQUESTED";


export const feedActions = {
  FEEDS_SUCCESS,
  FEEDS_FAILED,
  FEEDS_REQUESTED,
};


export const getAllFeeds = (request, token) => dispatch => {
  dispatch({
    type: feedActions.FEEDS_REQUESTED
  })
  return new Promise((resolve, reject) => {

    const onSuccess = (response) => {
      const data = response.data
      dispatch({
        type: feedActions.FEEDS_SUCCESS,
        payload: data
      })
      if (data.success) {
    //  console.log('data', data)
        resolve(data)
      }
    }
    const onFailure = (error) => {
      dispatch({
        type: feedActions.FEEDS_FAILED
      })
      reject(error.response)
    }
    axios.post(config.api.baseURL + "public_feed_list", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}


export const getFeeds = (request, token) => dispatch => {
  dispatch({
    type: feedActions.FEEDS_REQUESTED
  })
  return new Promise((resolve, reject) => {

    const onSuccess = (response) => {
      const data = response.data
      dispatch({
        type: feedActions.FEEDS_SUCCESS,
        payload: data
      })
      if (data.success) {
    //  console.log('data', data)
        resolve(data)
      }
    }
    const onFailure = (error) => {
      dispatch({
        type: feedActions.FEEDS_FAILED
      })
      reject(error.response)
    }
    axios.post(config.api.baseURL + "public_feed_list_pagination", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}

export const getPublicFeedCommentList = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "recent_feed_comment_list", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}

export const getPublicFeedComments = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "recent_feed_comment_list_pagination", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}

export const postFeedDetails = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "public_feed_details", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
export const postFeedLike = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "public_feed_like", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}


export const postFeedComment = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "public_feed_comment", request, {
      headers: {
        'Authorization': `Bearer ${token}`,
      //  accept: 'application/json',
        'content-type': 'multipart/form-data',
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}

export const postFeedCommentLike = (request, token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      console.log('data', data)
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      reject(error.response)
     // console.log('error.response', error.response.data)
    }
    axios.post(config.api.baseURL + "public_feed_comment_like", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}

export const publicFeedReport = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "public_feed_report", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
