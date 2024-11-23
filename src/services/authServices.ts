import { Auth } from '@/types/authType'
import { FileUploadResponse } from '@/types/fileUploadType'
import http from '@/utils/http'

type LoginParam = {
  email: string
  password: string
}

type RegisterParam = Omit<Auth, 'id' | 'avatar'>

type RequestResetPasswordParam = {
  email: string
}

type HandleResetPasswordParam = {
  email: string
  code: string
  password: string
}

const PREV_URL = '/auth'

const AuthServices = {
  login: (param: LoginParam) => {
    return http.post(PREV_URL + '/login', param)
  },

  register: (param: RegisterParam) => {
    return http.post(PREV_URL + '/register', param)
  },

  requestResetPassword: (param: RequestResetPasswordParam) => {
    return http.post(PREV_URL + '/request-reset-password', param)
  },
  handleResetPassword: (param: HandleResetPasswordParam) => {
    return http.post(PREV_URL + '/handle-reset-password', param)
  },

  updateAvatar: (param: { avatar: FileUploadResponse }) => {
    return http.put(PREV_URL + '/update-avatar', param)
  },
}

export default AuthServices
