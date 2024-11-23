import MessageTypeEnum from '@/constants/messages/MessageTypeEnum'
import { Auth } from './authType'
import { FileUploadResponse } from './fileUploadType'
import { Emoji } from './emojiType'
import { Chat } from './chatType'

export interface Message {
  file?: FileUploadResponse
  image?: FileUploadResponse
  text?: string
  emoji?: Emoji
  _id: string
  chat: string
  sender: Auth
  type: MessageTypeEnum
}

export interface MessageWithChat extends Omit<Message, 'chat'> {
  chat: Chat
}
