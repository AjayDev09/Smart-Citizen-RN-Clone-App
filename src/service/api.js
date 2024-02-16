import axios from "axios"
import config from '../config'


// export default () => {
//     const client = axios.create(config.api)
//     const getData ={
//         data(params) {
//             return client.request({
//                 method: 'get',
//                 url: params,
//             })
//         }
//     }

//     return {
//         getData
//     }
// }

let APIKit = axios.create(config.api)

const authInterceptor = config => {
  console.log('config,', config)
  let token = storage.loadState(constants.TOKEN)
  config.headers['authorization'] = token;
  return config;
}

const getConfig = ( config, token ) => {
  console.log('config, token', config, token)
  config.headers.Authorization = `Bearer ${token}`;
  return config;
}

//const myInterceptor = setClientToken(token)

const myInterceptor = token => APIKit.interceptors.request.use(config => getConfig(config, token));


export const setClientToken = token => {
  myInterceptor(myInterceptor(token))
}

// export const setClientToken = token => {
//   APIKit.interceptors.request.use(function (config) {
//     config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   });
// }

function setAuthHeader() {
  APIKit.interceptors.request.use(authInterceptor)
}
export const removeAuthHeader = token => {
  console.log('Removing auth header',  {APIKit})
  //APIKit.interceptors.request.eject(myInterceptor(token))
 // APIKit.interceptors.request.eject(config=> getConfig(config, token));
 APIKit.interceptors.request.eject(myInterceptor);
  console.log('After', { APIKit })
}

export default APIKit;
