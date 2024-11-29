import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from 'redux-thunk';
import logger from 'redux-logger'
import { addToCartReducer, authReducer, createUserReducer, getUserDataReducer, otpReducer, registrationDataReducer, userLoginReducer } from "./Reducers/userReducer";



const rootReducer = combineReducers({
    registrationData:registrationDataReducer,
    getOtp:otpReducer,
    createUser:createUserReducer,
    user:userLoginReducer,
    userData:getUserDataReducer,
    auth:authReducer,
    addToCart:addToCartReducer
})

const store = legacy_createStore(rootReducer,applyMiddleware(thunk,logger))
export default store
