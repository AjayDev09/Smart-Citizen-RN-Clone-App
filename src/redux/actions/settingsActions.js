import axios from "axios";
import { actions } from "./index";
import config from "../../config";

 
const CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS";
const CHANGE_PASSWORD_FAILED = "CHANGE_PASSWORD_FAILED";
 

export const settingsActions = {
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILED,
  };


  export const changePasswordApi = (request,token) => dispatch => {
   // console.log("changePasswordApi request", request)
    return new Promise((resolve, reject) => {
      //  
      const onSuccess = response => {
        const data = response.data
        //if (data.success) {
          resolve(data)
       // }
      }
      const onFailure = (error) => {
        console.log("change_password error:: ", error.response.data)
         reject(error.response)
      }
  
      axios
      .post(config.api.baseURL + "change_password", request,  {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);
    })
  }

  
  export const languageSettingApi = (request,token) => dispatch => {
    // console.log("changePasswordApi request", request)
     return new Promise((resolve, reject) => {
       //  
       const onSuccess = response => {
         const data = response.data
         //if (data.success) {
           resolve(data)
        // }
       }
       const onFailure = (error) => {
         console.log("language_setting error:: ", error.response.data)
          reject(error.response)
       }
   
       axios
       .post(config.api.baseURL + "language_setting", request,  {
         headers: {
           'Authorization': `Bearer ${token}`
         }
       })
       .then(onSuccess)
       .catch(onFailure);
     })
   }

  export const CardStatusApi = (token) => dispatch => {
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
      .get(config.api.baseURL + "get-card",   {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);
    })
  }
 

  export const ApplyCardApi = (request,token) => dispatch => {
    console.log("ApplyCardApi request", request)
    return new Promise((resolve, reject) => {
      const onSuccess = response => {
        const data = response.data
        if (data.success) {
          resolve(data)
        }
      }
      const onFailure = (error) => {
        console.log("apply-card error:: ", error.response.data)
         reject(error.response)
      }
  
      axios
      .post(config.api.baseURL + "apply-card", request,  {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);
    })
  }

  export const CancelCardApi = (request,token) => dispatch => {
    console.log("CancelCardApi request", request)
    return new Promise((resolve, reject) => {
      const onSuccess = response => {
        const data = response.data
        if (data.success) {
          resolve(data)
        }
      }
      const onFailure = (error) => {
        console.log("cancelled-card error:: ", error.response.data)
         reject(error.response)
      }
  
      axios
      .post(config.api.baseURL + "cancelled-card", request,  {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);
    })
  }
  export const cmsPagesListApi = (token) => dispatch => {
    return new Promise((resolve, reject) => {
      const onSuccess = response => {
        const data = response.data
        if (data.success) {
          resolve(data)
        }
      }
      const onFailure = (error) => {
        console.log("cms_pages_list error:: ", error.response.data)
         reject(error.response)
      }
  
      axios
      .get(config.api.baseURL + "cms_pages_list",  {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);
    })
  }
  export const ShareApi = (request, token) => dispatch => {
    return new Promise((resolve, reject) => {
      const onSuccess = response => {
        const data = response.data
        if (data.success) {
          resolve(data)
        }
      }
      const onFailure = (error) => {
        console.log("share error:: ", error.response.data)
         reject(error.response)
      }
  
      axios
      .post(config.api.baseURL + "share", request,  {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);
    })
  }

  export const removeCommentApi = (request, token) => dispatch => {
    console.log("share request")
    return new Promise((resolve, reject) => {
      const onSuccess = response => {
        const data = response.data
        if (data.success) {
          resolve(data)
        }
      }
      const onFailure = (error) => {
        console.log("share error:: ", error.response.data)
         reject(error.response)
      }
  
      axios
      .post(config.api.baseURL + "remove_comment", request,  {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(onSuccess)
      .catch(onFailure);
    })
  }