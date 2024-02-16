import { actions } from "../actions";



const initialState = {
    isRequesting: false,
    errors: undefined,
    coupons: '',
    couponsCategory: '',
    locationList: [],
}



export default function couponReducer(state = initialState, action) {
    switch (action.type) {
        case actions.coupon.COUPON_REQUESTED:
            return Object.assign({}, { ...state, isRequesting: true, errors: undefined });
        case actions.coupon.COUPONS_SUCCESS:
            return Object.assign({}, {
                ...state,
                isRequesting: false,
                errors: undefined,
                coupons: action.payload.data,
            })

        case actions.coupon.COUPONS_FAILED:
            return Object.assign({}, { ...state, isRequesting: false, errors: undefined });
        case actions.coupon.COUPONS_ADD_EDIT:
            return Object.assign({}, { ...state, isRequesting: false, errors: undefined });
        case actions.coupon.COUPONS_CATEGORY_SUCCESS:
            return Object.assign({}, {
                ...state,
                isRequesting: false,
                errors: undefined,
                couponsCategory: action.payload.data,
            })
        case actions.coupon.LOCATION_LIST:
            return Object.assign({}, {
                ...state,
                isRequesting: false,
                errors: undefined,
                locationList: action.payload.data,
            })
        default:
            return state;
    }

}