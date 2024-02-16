import { actions } from "../actions";

const initialState = {
    isRequesting: false,
    errors: undefined,
    loggedIn: false,
    userId: '',
    token: '',
    refreshToken: '',
    expiresOn: '',
    data: '',
    userIndex: 0,
    fcmToken: '',
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case actions.login.IS_LOGGED_IN:
            return Object.assign({}, { ...state, loggedIn: true, isRequesting: false, });
        case actions.login.LOGIN_REQUESTED:
            //     console.log('authReducer state', state)
            return Object.assign({}, { ...state, isRequesting: true, errors: undefined });
        case actions.login.LOGIN_SUCCESS:
            return Object.assign(
                {},
                {
                    ...state,
                    isRequesting: false,
                    errors: undefined,
                    // loggedIn: true,
                    token: action.payload && action.payload.token,
                    data: action.payload,
                },
            );
        // case actions.login.PROFILE_SUCCESS:
        //     return Object.assign(
        //         {},
        //         {
        //             ...state,
        //             isRequesting: false,
        //             errors: undefined,
        //             data: action.payload,
        //         },
        //     );
        case actions.login.REGISTER_SUCCESS:
            return Object.assign(
                {},
                {
                    ...state,
                    isRequesting: false,
                    errors: undefined,
                    // loggedIn: false,
                    token: action.payload && action.payload.token,
                    data: action.payload,
                },
            );
        case actions.login.VERIFY_SUCCESS:
            return Object.assign(
                {},
                {
                    ...state,
                    isRequesting: false,
                    errors: undefined,
                    loggedIn: true,
                    // token: action.payload.token,
                    // data: action.payload,
                },
            );
        case actions.login.LOGIN_FAILED:
            return Object.assign(
                {},
                {
                    ...state,
                    isRequesting: false,
                    errors: action.payload,
                    //  loggedIn: false,
                    //  token: '',
                    //   data: ''
                },
            );
        case actions.login.LOGIN_FAILED:
            return Object.assign(
                {},
                {
                    ...state,
                    isRequesting: false,
                    errors: action.payload,
                    //  loggedIn: false,
                    //  token: '',
                    //   data: ''
                },
            );
        case actions.login.FORGOT_PASSWORD_SUCCESS:
            return Object.assign(
                {},
                {
                    ...state,
                    isRequesting: false,
                },
            );
        case actions.login.LOGOUT:
            return Object.assign(
                {},
                initialState,
            );
        default:
            return state;
    }

}
