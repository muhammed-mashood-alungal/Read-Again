import axios from "axios"
import { CHANGE_PASS_FAILED, CHANGE_PASS_REQUEST, CHANGE_PASS_SUCCESS, CREATE_USER_FAILED, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, GET_OTP_FAILED, GET_OTP_REQUEST, GET_OTP_SUCCESS, GET_USER_DATA_FAILED, GET_USER_DATA_REQUEST, GET_USER_DATA_SUCCESS, LOGIN_FAILED, LOGIN_REQUEST, LOGIN_SUCCESS, SET_REGISTRATION_DATA } from "../Constants/userConstants"
import { axiosUserInstance } from "../Constants/axiosConstants"

export const setRegistrationData=(data)=>{
  return {
    type:SET_REGISTRATION_DATA,
    payload:data
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
    const response = await axiosUserInstance.post('/create',{userData})
    if(response.status === 200){
      localStorage.setItem("userInfo",response.data.userInfo)
      localStorage.setItem("token",response.data.token)
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
     const response = await axiosUserInstance.post('/login',{userData})
     if(response.status == 200){
      localStorage.setItem("userInfo",response.data.userInfo)
      localStorage.setItem("token",response.data.token)
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

    // withCredentials: true, // Enables sending cookies with the request
    // headers: {
    //   'Authorization': 'Bearer your_token_here', // Example header
    //   'Content-Type': 'application/json' // Set any other headers you need
    // }
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

