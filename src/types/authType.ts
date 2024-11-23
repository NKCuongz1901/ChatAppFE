import { FileUploadResponse } from './fileUploadType'

export interface Auth {
  _id: string
  fullName: string
  email: string
  avatar?: FileUploadResponse | null
  gender: number
  birthdate: Date
}

export interface AuthResponse {
  user: Auth
  token: string
}
