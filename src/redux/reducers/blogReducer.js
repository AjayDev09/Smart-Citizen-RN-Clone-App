import { actions } from "../actions";

const initialState = {
    isRequesting: false,
    errors: undefined,
    blogs: '',
}

export default function blogReducer(state = initialState, action) {
    switch (action.type) {
        case actions.blog.BLOGS_REQUESTED:
            return Object.assign({}, { ...state, isRequesting: true, errors: undefined });
        case actions.blog.BLOGS_SUCCESS:
            return Object.assign({}, {
                ...state,
                isRequesting: false,
                errors: undefined,
                blogs: action.payload.data,
            })
            case actions.blog.BLOGS_FAILED:
                return Object.assign({}, { ...state, isRequesting: false, errors: undefined });
        default:
            return state;
    }

}