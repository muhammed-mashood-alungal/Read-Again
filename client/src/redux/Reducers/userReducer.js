import { CHANGE_PASS_FAILED, CHANGE_PASS_REQUEST, CHANGE_PASS_SUCCESS, CREATE_USER_FAILED, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, GET_OTP_FAILED, GET_OTP_REQUEST, GET_OTP_SUCCESS, GET_USER_DATA_FAILED, GET_USER_DATA_REQUEST, GET_USER_DATA_SUCCESS, LOGIN_FAILED, LOGIN_REQUEST, LOGIN_SUCCESS, REMOVE_AUTH, REMOVE_REGISTRATION_DATA, SET_AUTH, SET_REGISTRATION_DATA} from "../Constants/userConstants";

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
export const authReducer = (state={},action)=>{
  switch(action.type){
    case SET_AUTH :
      return {isLoggedIn:action.payload.isLoggedIn , role : action.payload.role}
    default :
      return state
  }
}