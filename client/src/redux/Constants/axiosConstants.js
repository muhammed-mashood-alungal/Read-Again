import axios from 'axios'

export const axiosUserInstance = axios.create({
    baseURL:"http://localhost:5000/api/users"
})
export const axiosAdminInstance = axios.create({
    baseURL:"http://localhost:5000/api/admin"
})
export const axiosBookInstance = axios.create({
      baseURL:"http://localhost:5000/api/books"
})
export const axiosCategoryInstance = axios.create({
    baseURL:"http://localhost:5000/api/categories"
})