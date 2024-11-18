import axios from "axios"
import { CHANGE_PASS_FAILED, CHANGE_PASS_REQUEST, CHANGE_PASS_SUCCESS, CREATE_USER_FAILED, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, GET_OTP_FAILED, GET_OTP_REQUEST, GET_OTP_SUCCESS, GET_USER_DATA_FAILED, GET_USER_DATA_REQUEST, GET_USER_DATA_SUCCESS, LOGIN_FAILED, LOGIN_REQUEST, LOGIN_SUCCESS, REMOVE_AUTH, SET_AUTH, SET_REGISTRATION_DATA } from "../Constants/userConstants"
import { axiosUserInstance } from "../Constants/axiosConstants"

export const setRegistrationData=(data)=>{
  return {
    type:SET_REGISTRATION_DATA,
    payload:data
  }
}
export const setAuth =(data)=>{
  localStorage.setItem('auth', JSON.stringify(data)); 
  return {
    type : SET_AUTH,
    payload:data
  }
}
export const removeAuth=()=>{
  localStorage.removeItem('auth');
  return {
    type : REMOVE_AUTH
  }
}

export const getOtp = (email)=> async (dispatch)=>{
  try{
    dispatch({type : GET_OTP_REQUEST })
   const response = await  axiosUserInstance.post(`/${email}/get-otp`)
   dispatch({type : GET_OTP_SUCCESS })
   return true
  }catch(err){
    console.log(err)
    dispatch({type : GET_OTP_FAILED , payload : err?.response?.data.message })
    return false
  }
}
export const createUser = (userData) => async (dispatch)=>{
  try{
    dispatch({type : CREATE_USER_REQUEST})
    const response = await axiosUserInstance.post('/create',{userData}, {
      withCredentials: true, 
  })
    if(response.status === 200){
      dispatch({type: CREATE_USER_SUCCESS , payload : response.data})
      return true
    }
  }catch(err){
    console.log(err)
    dispatch( {type : CREATE_USER_FAILED , payload : err.response.data.message})
    return false
  }
}
export const userLogin = (userData) => async(dispatch) =>{
  try{
    
     dispatch({type : LOGIN_REQUEST})
     const response = await axiosUserInstance.post('/login',{userData}, {
      withCredentials: true, // Required to send cookies
  })
     if(response.status == 200){
     dispatch({type: LOGIN_SUCCESS ,payload : response.data.userInfo})
     return true
     }
  }catch(err){
    dispatch({type : LOGIN_FAILED , payload : err.response.data.message})
    return false
  }
}

export const changePass = (email,password) =>async (dispatch) =>{
  try{
    dispatch({type:CHANGE_PASS_REQUEST})

    await axiosUserInstance.put(`/${email}/new-password`,{password})
    dispatch({type:CHANGE_PASS_SUCCESS})
    return true
  }catch(err){
    dispatch({type:CHANGE_PASS_FAILED})
    return false
  }
}
export const getUserData =()=>async(dispatch) =>{
  try{
    dispatch({type : GET_USER_DATA_REQUEST})
    const token = localStorage.getItem("token")
    const {userData} = await axiosUserInstance.get(`/token-verify`,{
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    dispatch({type: GET_USER_DATA_SUCCESS , payload : userData})
  }catch(err){
    console.log(err)
    dispatch({type:GET_USER_DATA_FAILED , payload : err?.response?.data?.message})
  }
}

