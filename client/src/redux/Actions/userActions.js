import axios from "axios"
import { ADD_TO_CART_FAILED, ADD_TO_CART_REQUEST, ADD_TO_CART_SUCCESS, ADD_TO_WISHLIST_REQUEST, ADD_TO_WISHLIST_SUCCESS, CART_ITEM_COUNT_DEC, CART_ITEM_COUNT_INC, CART_ITEMS_COUNT_DEC, CART_ITEMS_COUNT_INC, CHANGE_PASS_FAILED, CHANGE_PASS_REQUEST, CHANGE_PASS_SUCCESS, CLEAR_CART_ITEMS, CLEAR_CART_ITEMS_COUNT, CREATE_USER_FAILED, CREATE_USER_REQUEST, CREATE_USER_SUCCESS, GET_OTP_FAILED, GET_OTP_REQUEST, GET_OTP_SUCCESS, GET_USER_DATA_FAILED, GET_USER_DATA_REQUEST, GET_USER_DATA_SUCCESS, LOGIN_FAILED, LOGIN_REQUEST, LOGIN_SUCCESS, REMOVE_AUTH, RESET_CART_STATES, SET_AUTH, SET_CART_ITEMS_COUNT, SET_REGISTRATION_DATA } from "../Constants/userConstants"
import { axiosCartInstance, axiosUserInstance, axiosWishlistInstance } from "../Constants/axiosConstants"
import { toast } from "react-toastify"

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
export const incCartItemCount =(incCount)=>{
  return {
    type: CART_ITEMS_COUNT_INC,
    payload:incCount
  }
}
export const decCartItemCount =(decCount)=>{
  return {
    type: CART_ITEMS_COUNT_DEC,
    payload:Math.abs(decCount)
  }
}
export const setCartItemsCount=(count)=>{
  return {
    type:SET_CART_ITEMS_COUNT,
    payload:count || 0
  }
}
export const ClearCartItems =()=>{
  return {
    type: CLEAR_CART_ITEMS_COUNT
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
    dispatch({type : GET_OTP_FAILED , payload : err?.response?.data?.message })
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

export const addToCart =(userId,itemInfo)=>async (dispatch)=>{
  try{
   dispatch({type:ADD_TO_CART_REQUEST})
   
    const response = await axiosCartInstance.post(`/${userId}/add-to-cart`,{itemInfo})
    if(response.status == 200){
      dispatch({type:ADD_TO_CART_SUCCESS})
      dispatch(incCartItemCount(parseInt(itemInfo.quantity)))
      toast.success("Item Added to cart")
    }
    return true
    
  }catch(err){
   dispatch({type:ADD_TO_CART_FAILED,payload:err?.response?.data?.message})
   toast.error(err?.response?.data?.message || "Network Error")
   return false
    console.log(err)
  }
}
export const resetCartStates=()=>{
  return{
    type:RESET_CART_STATES
  }
}
export const addToWishlist=(userId,itemId)=>async (dispatch)=>{
  try{
    dispatch({type:ADD_TO_WISHLIST_REQUEST})

    const response = await axiosWishlistInstance.post(`/${userId}`,{itemId})
     if(response.status == 200){
       dispatch({type:ADD_TO_WISHLIST_SUCCESS})
       //dispatch(incCartItemCount(parseInt(itemInfo.quantity)))
       toast.success("Item Added to Wishlist")
     }
   }catch(err){
    dispatch({type:ADD_TO_CART_FAILED,payload:err?.response?.data?.message})
    toast.error(err?.response?.data?.message || "Network Error")
     console.log(err)
   }
}
