import FriendTypeEnum from '@/constants/friends/FriendTypeEnum'
import { Auth } from './authType'

export interface Friend {
  _id: string
  userFromId: Auth | string
  userToId: Auth | string
  status: FriendTypeEnum
}
