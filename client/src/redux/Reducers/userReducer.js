import { toast } from "react-toastify";
import { axiosOrderInstance } from "../Constants/axiosConstants";
import { ADD_TO_CART_FAILED, ADD_TO_CART_REQUEST, ADD_TO_CART_SUCCESS, ADD_TO_WISHLIST_REQUEST, CART_ITEM_COUNT_DEC, CART_ITEM_COUNT_INC, CART_ITEMS_COUNT_DEC, CART_ITEMS_COUNT_INC, CHANGE_PASS_FAILED, CHANGE_PASS_REQUEST, CHANGE_PASS_SUCCESS, CLEAR_CART_ITEMS, CLEAR_CART_ITEMS_COUNT, CREATE_USER_FAILED, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, GET_OTP_FAILED, GET_OTP_REQUEST, GET_OTP_SUCCESS, GET_USER_DATA_FAILED, GET_USER_DATA_REQUEST, GET_USER_DATA_SUCCESS, LOGIN_FAILED, LOGIN_REQUEST, LOGIN_SUCCESS, REMOVE_AUTH, REMOVE_REGISTRATION_DATA, RESET_CART_STATES, SET_AUTH, SET_CART_ITEMS_COUNT, SET_REGISTRATION_DATA} from "../Constants/userConstants";
import { useDispatch, useSelector } from "react-redux";

export const registrationDataReducer=(state={},action)=>{
   switch(action.type){
    case SET_REGISTRATION_DATA:
        return {...state,...action.payload}
    case REMOVE_REGISTRATION_DATA:
        return {}
    default :
        return state
   }
}

export const otpReducer = (state={},action)=>{
    switch(action.type){
        case GET_OTP_REQUEST:
          return {...state,loading : true , error:null}
        case GET_OTP_SUCCESS:
          return {...state,loading : false , error:null}
        case GET_OTP_FAILED:
          return {...state,loading : false ,error : action.payload}
        default :
          return state
    }
}
export const createUserReducer = (state={},action)=>{
  switch(action.type){
    case CREATE_USER_REQUEST:
      return {...state, loading : true , error : null}
    case CREATE_USER_SUCCESS :
      return {...state, loading : false , userInfo : action.payload.userData ,token:action.payload.token, error : null}
    case CREATE_USER_FAILED : 
      return {...state, loading : false , error : action.payload}
    default :
      return state
  }
}
export const userLoginReducer = (state={},action)=>{
  switch(action.type){
    case LOGIN_REQUEST:
      return {loading : true, error :null}
    case LOGIN_SUCCESS:
      return {loading : false , error :null , userInfo :action.payload.userInfo , token : action.payload.token}
    case LOGIN_FAILED:
      return {loading : false , error : action.payload}
    default : 
      return state
  }
}
export const changePassReducer = (state={},action)=>{
   switch(action.type){
    case CHANGE_PASS_REQUEST:
      return {loading : true , error : null}
    case CHANGE_PASS_SUCCESS:
      return {laoding :false , error:null}
    case CHANGE_PASS_FAILED :
      return {loading : false , error : action.payload}
    default :
      return state
   }
}
export const getUserDataReducer = (state={},action) =>{
  switch(action.type){
    case GET_USER_DATA_REQUEST:
      return {loading : true , error : null}
    case GET_USER_DATA_SUCCESS:
      return {loading : false , userData :action.payload ,error : null}
    case GET_USER_DATA_FAILED:
      return {loading : false , error : action.payload }
    default :
      return state
  }
}

const initialState = JSON.parse(localStorage.getItem('auth')) || {
  isLoggedIn: false,
  role: undefined,
};
export const authReducer = (state=initialState,action)=>{
  switch(action.type){
    case SET_AUTH :
      return {isLoggedIn:action.payload.isLoggedIn , role : action.payload.role , userId:action.payload.id}
    case REMOVE_AUTH:
      return {isLoggedIn : false , role : null}
    default :
      return state
  }
}
export const addToCartReducer = (state={cartError:null,success:false},action)=>{
  switch(action.type){
    case ADD_TO_CART_REQUEST:
      return {loading:true , cartError: null , success:false}
    case ADD_TO_CART_SUCCESS:
       return {loading :false , cartError:null , success:true}
    case ADD_TO_CART_FAILED:
      return {loading:false , cartError:action.payload , success:false}
    case RESET_CART_STATES :
      return {loading:false , cartError : null , success:false}
    default :
      return state
  }
}




export const cartItemsCountReducer =(state={cartCount:0},action)=>{
  switch(action.type){
    case SET_CART_ITEMS_COUNT:
      return {...state,cartCount:action.payload}
    case CART_ITEMS_COUNT_INC:
      return {...state,cartCount:state.cartCount+action.payload}
    case CART_ITEMS_COUNT_DEC:
      return {...state,cartCount:state.cartCount-action.payload}
    case CLEAR_CART_ITEMS_COUNT:
      return {...state,cartCount:0}
    default:
      return state
  }
}

export const addToWishlistReducer=(state={},action)=>{
  switch(action.type){
    case ADD_TO_WISHLIST_REQUEST:
      return {...state, loading:true,wishlistError:null}
    case ADD_TO_CART_SUCCESS:
      return {...state,loading : false  , wishlistError:null}
    case ADD_TO_CART_FAILED:
      return {...state , loading : false , wishlistError : action.payload}
    default :
      return state
  }
}