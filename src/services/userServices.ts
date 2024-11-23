import http from '@/utils/http'

const PREV_URL = '/users'
export const UserKey = 'users'

const UserServices = {
  all: (key: string) => {
    return http.get(`${PREV_URL}?key=${key}`)
  },
}

export default UserServices
