import axios from 'axios'
const BACKEND_BASE_URI = 'https://api.mashood.site'
export const axiosUserInstance = axios.create({
    baseURL: `${BACKEND_BASE_URI}/api/users`,
    withCredentials: true
})
export const axiosAdminInstance = axios.create({
    baseURL: `${BACKEND_BASE_URI}/api/admin`,
    withCredentials: true
})
export const axiosBookInstance = axios.create({
    baseURL: `${BACKEND_BASE_URI}/api/books`,
    withCredentials: true
})
export const axiosCategoryInstance = axios.create({
    baseURL: `${BACKEND_BASE_URI}/api/categories`,
    withCredentials: true
})
export const axiosAuthInstance = axios.create({
    baseURL: `${BACKEND_BASE_URI}/api/auth`,
    withCredentials: true
})
export const axiosCartInstance = axios.create({
    baseURL: `${BACKEND_BASE_URI}/api/cart`,
    withCredentials: true
})
export const axiosOrderInstance = axios.create({
    baseURL: `${BACKEND_BASE_URI}/api/orders`,
    withCredentials: true
})
export const axiosCouponInstance = axios.create({
    baseURL: `${BACKEND_BASE_URI}/api/coupons`,
    withCredentials: true
})
export const axiosWishlistInstance = axios.create({
    baseURL: `${BACKEND_BASE_URI}/api/wishlist`,
    withCredentials: true
})
export const axiosOfferInstance = axios.create({
    baseURL: `${BACKEND_BASE_URI}/api/offers`,
    withCredentials: true
})
export const axiosRazorpayInstance = axios.create({
    baseURL: `${BACKEND_BASE_URI}/api/razorpay`,
    withCredentials: true
})