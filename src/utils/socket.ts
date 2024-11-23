import { io } from 'socket.io-client'

const URL = 'http://localhost:80/'

export const socket = io(URL, {
  transports: ['websocket', 'polling'],
})
