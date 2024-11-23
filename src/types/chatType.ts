import { Auth } from './authType'
import { Message } from './messageType'

export interface Chat {
  _id: string
  name?: string
  isGroup: boolean
  users: Auth[]
  groupAdmin?: Auth
  latestMessage?: Message
}
