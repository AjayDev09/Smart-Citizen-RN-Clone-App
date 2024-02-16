import { actions } from "../actions";

const initialState = {
    isRequesting: false,
    errors: undefined,
    profile: '',
    notificationList:[]
};
export default function usersReducer(state = initialState, action) {
    switch (action.type) {
        case actions.login.LOGIN_REQUESTED:
            return Object.assign({}, { ...state, isRequesting: true, errors: undefined });

        case actions.login.PROFILE_SUCCESS:
            return Object.assign(
                {},
                {
                    ...state,
                    profile: action.payload,
                },
            );
        case actions.login.PROFILE_FAILED:
            return Object.assign(
                {},
                {
                    ...state,
                    isRequesting: false,
                    errors: action.payload
                },
            );
        case actions.login.NOTIFICATION_LIST:
            return Object.assign(
                {},
                {
                    ...state,
                    notificationList: action.payload,
                    isRequesting: false,
                    errors: action.payload
                },
            );
        default:
            return state;
    }

}
