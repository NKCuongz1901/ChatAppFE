import http from '@/utils/http'

const PREV_URL = '/friends'
export const FriendKey = 'friends'

const FriendServices = {
  all: () => {
    return http.get(PREV_URL)
  },
  requests: () => {
    return http.get(`${PREV_URL}/requests`)
  },
  add: (id: string) => {
    return http.post(`${PREV_URL}/add/${id}`)
  },
  accept: (id: string) => {
    return http.post(`${PREV_URL}/accept/${id}`)
  },
}

export default FriendServices
