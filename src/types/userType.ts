import { Auth } from './authType'
import { Friend } from './friendType'

export interface UserWithFriend extends Auth {
  friend?: Friend
}
