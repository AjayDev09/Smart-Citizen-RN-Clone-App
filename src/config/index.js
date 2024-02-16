import { IS_CLIENT_SERVER } from "./appConfig";

export default {
    api:{
        baseURL: IS_CLIENT_SERVER ? 'https://toshavhaham.co.il/smartapp/api/' : 'https://knp-tech.in/smartapp/api/',
        // baseURL: IS_CLIENT_SERVER ? 'https://toshavhaham.co.il/smartapp/api/' :
        //  'http://15.207.152.121/smartapp/api/',
        timeout: 25000,
    },
}  