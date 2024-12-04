import axios from 'axios'

export const axiosUserInstance = axios.create({
    baseURL:"http://localhost:5000/api/users",
    withCredentials: true
})
export const axiosAdminInstance = axios.create({
    baseURL:"http://localhost:5000/api/admin",
    withCredentials: true
})
export const axiosBookInstance = axios.create({
      baseURL:"http://localhost:5000/api/books",
      withCredentials: true
})
export const axiosCategoryInstance = axios.create({
    baseURL:"http://localhost:5000/api/categories",
    withCredentials: true
})
export const axiosAuthInstance = axios.create({
    baseURL:"http://localhost:5000/api/auth",
    withCredentials:true
})
export const axiosCartInstance = axios.create({
    baseURL:"http://localhost:5000/api/cart",
    withCredentials: true
})
export const axiosOrderInstance = axios.create({
    baseURL:"http://localhost:5000/api/orders",
    withCredentials: true
})