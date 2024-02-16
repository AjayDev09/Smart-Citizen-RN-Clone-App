import { actions } from "../actions";



const initialState = {
    isRequesting: false,
    errors: undefined,
    feeds: '',
}



export default function feedReducer(state = initialState, action) {
    switch (action.type) {
        case actions.feed.FEEDS_REQUESTED:
            return Object.assign({}, { ...state, isRequesting: true, errors: undefined });
        case actions.feed.FEEDS_SUCCESS:
            return Object.assign({}, {
                ...state,
                isRequesting: false,
                errors: undefined,
                feeds: action.payload.data,
            })
            case actions.feed.FEEDS_FAILED:
                return Object.assign({}, { ...state, isRequesting: false, errors: undefined });
        default:
            return state;
    }

}