import http from '@/utils/http'

const PREV_URL = '/notifications'
export const NotificationKey = 'notifications'

const NotificationServices = {
  all: () => {
    return http.get(PREV_URL)
  },
  checked: (id: number) => {
    return http.put(`${PREV_URL}/${id}/checked`)
  },
}

export default NotificationServices
