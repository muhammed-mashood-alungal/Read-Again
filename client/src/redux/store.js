import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from 'redux-thunk';
import logger from 'redux-logger'
import { addToCartReducer, addToWishlistReducer, authReducer, cartItemsCountReducer, createUserReducer, getUserDataReducer, otpReducer, registrationDataReducer, userLoginReducer, wishlistItemsCountReducer } from "./Reducers/userReducer";



const rootReducer = combineReducers({
    registrationData:registrationDataReducer,
    getOtp:otpReducer,
    createUser:createUserReducer,
    user:userLoginReducer,
    userData:getUserDataReducer,
    auth:authReducer,
    addToCart:addToCartReducer,
    cartItemsCount:cartItemsCountReducer,
    addToWishlist:addToWishlistReducer,
    wishlistCount:wishlistItemsCountReducer
})

const store = legacy_createStore(rootReducer,applyMiddleware(thunk,logger))
export default store
