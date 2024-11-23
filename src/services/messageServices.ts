import MessageTypeEnum from '@/constants/messages/MessageTypeEnum'
import { FileUploadResponse } from '@/types/fileUploadType'
import http from '@/utils/http'

const PREV_URL = '/messages'
export const MessageKey = 'messages'

type CreateMessageParam = {
  content: string | FileUploadResponse
  chatId: string
  type: MessageTypeEnum
}

const MessageServices = {
  all: (chatId: string) => {
    return http.get(`${PREV_URL}/${chatId}`)
  },
  create: (content: CreateMessageParam) => {
    return http.post(PREV_URL, content)
  },
  delete: (id: string) => {
    return http.delete(`${PREV_URL}/${id}`)
  },
}

export default MessageServices
