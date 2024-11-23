import { useAppDispatch } from '@/app/hooks'
import { FileUploadResponse } from '@/types/fileUploadType'
import { type ClassValue, clsx } from 'clsx'
import { useLocation } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { getUserLS, setUserLS } from './authLS'
import { updateAuth } from '@/features/auth/authSlice'
import { Message } from '@/types/messageType'
import MessageTypeEnum from '@/constants/messages/MessageTypeEnum'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkActiveRoute = (route: string, isIndex?: boolean) => {
  const location = useLocation()

  if (!isIndex) {
    return location.pathname.includes(route)
  }
  return location.pathname === route
}

export const updateAvatarAuth = () => {
  const dispatch = useAppDispatch()
  return (avatar?: FileUploadResponse | null) => {
    const authLS = getUserLS()
    if (!authLS) {
      return
    }
    authLS.avatar = avatar
    setUserLS(authLS)
    dispatch(
      updateAuth({
        isAuthenticated: true,
        user: authLS,
      })
    )
  }
}

export const showLastMessage = (message: Message) => {
  switch (message.type) {
    case MessageTypeEnum.TEXT:
      return message.text
    case MessageTypeEnum.EMOJI:
    case MessageTypeEnum.FILE:
    case MessageTypeEnum.IMAGE:
      return `Đã gửi một ${MessageTypeEnum.getNameByValue(message.type)}`
    default:
      return ``
  }
}
