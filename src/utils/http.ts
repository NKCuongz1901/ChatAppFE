import axios from 'axios'
import { toast } from 'react-toastify'
import { getTokenLS } from './authLS'
import { sendEvent } from './event'

const BASE_URL = 'http://localhost:80/v1'

const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

http.interceptors.request.use((request) => {
  const accessToken = getTokenLS()

  if (!request.headers['Content-Type']) {
    request.headers['Content-Type'] = 'application/json'
  }

  request.headers.Authorization = 'Bearer ' + accessToken
  return request
})

http.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message === 'Token expired') {
        try {
          sendEvent('auth:redirectLogin', null)
          toast.error(error.response?.data.message)
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default http
