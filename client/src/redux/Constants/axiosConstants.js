import axios from 'axios'

export const axiosUserInstance = axios.create({
    baseURL:"http://localhost:5000/api/users"
})