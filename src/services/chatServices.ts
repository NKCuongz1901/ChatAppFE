import http from '@/utils/http'

const PREV_URL = '/chats'
export const ChatKey = 'chats'

const ChatServices = {
  all: () => {
    return http.get(PREV_URL)
  },
  get: (id: string) => {
    return http.get(`${PREV_URL}/${id}`)
  },
  messages: (chatId: string) => {
    return http.get(`${PREV_URL}/${chatId}/messages`)
  },
  createGroup: (data: { users: string[]; name: string }) => {
    return http.post(`${PREV_URL}/groups`, data)
  },
  addToGroup: (chatId: string, data: { userId: string }) => {
    return http.put(`${PREV_URL}/groups/${chatId}/add`, data)
  },
  removeFromGroup: (chatId: string, data: { userId: string }) => {
    return http.put(`${PREV_URL}/groups/${chatId}/remove`, data)
  },
}

export default ChatServices
