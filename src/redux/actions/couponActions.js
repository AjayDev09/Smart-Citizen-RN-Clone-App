import axios from "axios";
import { actions } from "./index";
import config from "../../config";


const COUPONS_SUCCESS = "COUPONS_SUCCESS";
const COUPONS_FAILED = "COUPONS_FAILED";
const COUPON_REQUESTED = "COUPON_REQUESTED";
const COUPONS_CATEGORY_SUCCESS = "COUPONS_CATEGORY_SUCCESS";
const LOCATION_LIST = "LOCATION_LIST";


export const couponActions = {
  COUPONS_SUCCESS,
  COUPONS_FAILED,
  COUPON_REQUESTED,
  COUPONS_CATEGORY_SUCCESS,
  LOCATION_LIST,
};


export const getAllCoupons = (request, token) => dispatch => {
  dispatch({
    type: couponActions.COUPON_REQUESTED
  })
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      dispatch({
        type: couponActions.COUPONS_SUCCESS,
        payload: data
      })
      if (data.success) {
        resolve(data)
      }


    }
    const onFailure = (error) => {
      dispatch({
        type: couponActions.COUPONS_FAILED
      })
      reject(error.response)
    }
    axios.post(config.api.baseURL + "coupon_list", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })

}
export const getCoupons = (request, token) => dispatch => {
  dispatch({
    type: couponActions.COUPON_REQUESTED
  })
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      dispatch({
        type: couponActions.COUPONS_SUCCESS,
        payload: data
      })
      if (data.success) {
        resolve(data)
      }
    }
    const onFailure = (error) => {
      dispatch({
        type: couponActions.COUPONS_FAILED
      })
      reject(error.response)
    }
    axios.post(config.api.baseURL + "coupon_list_pagination", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })

}

export const couponDetails = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "coupon_details", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}

export const postAddMyCoupon = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "add_mycoupon", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)
  })
}
export const postSaveMyCoupon = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "save_coupon", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)
  })
}


export const getCientMyCoupon = (token) => dispatch => {
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
    axios.get(config.api.baseURL + "client_mycoupon_list", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
export const getCouponCategoryList = (token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
      dispatch({
        type: couponActions.COUPONS_CATEGORY_SUCCESS,
        payload: data
      })
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.get(config.api.baseURL + "get-categories", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)

  })
}
export const postAddCoupon = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "add_coupon", request, {
      headers: {
        'Authorization': `Bearer ${token}`,
        //  accept: 'application/json',
        'content-type': 'multipart/form-data',
      }
    }).then(onSuccess)
      .catch(onFailure)
  })
}
export const postUpdateCoupon = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "update_coupon", request, {
      headers: {
        'Authorization': `Bearer ${token}`,
        //  accept: 'application/json',
        'content-type': 'multipart/form-data',
      }
    }).then(onSuccess)
      .catch(onFailure)
  })
}
export const postDeleteCoupon = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "delete_coupon", request, {
      headers: {
        'Authorization': `Bearer ${token}`,
        //  accept: 'application/json',
        // 'content-type': 'multipart/form-data',
      }
    }).then(onSuccess)
      .catch(onFailure)
  })
}
export const getStatisticsCoupon = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "coupon_statistics", request, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }).then(onSuccess)
      .catch(onFailure)
  })
}
export const getlocationList = (token) => dispatch => {
  return new Promise((resolve, reject) => {
    const onSuccess = (response) => {
      const data = response.data
      if (data.success) {
        resolve(data)
      }
      dispatch({
        type: couponActions.LOCATION_LIST,
        payload: data
      })
    }
    const onFailure = (error) => {
      reject(error.response)
    }
    axios.get(config.api.baseURL + "location_list", {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }).then(onSuccess)
      .catch(onFailure)
  })
}

export const postReviewRatingCoupon = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "review_rating_coupon", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)
  })
}

export const postdeleteCouponImage = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "delete_coupon_image", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)
  })
}

export const getCouponReviews = (request, token) => dispatch => {
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
    axios.post(config.api.baseURL + "indivisual_coupon_rating", request, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(onSuccess)
      .catch(onFailure)
  })

}