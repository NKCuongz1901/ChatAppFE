import { useAppSelector } from '@/app/hooks'
import ChatEvent from '@/constants/events/ChatEvent'
import FriendEvent from '@/constants/events/FriendEvent'
import MessageEvent from '@/constants/events/MessageEvent'
import { selectAuth } from '@/features/auth/authSlice'
import { ChatKey } from '@/services/chatServices'
import { Auth } from '@/types/authType'
import { Chat } from '@/types/chatType'
import { Friend } from '@/types/friendType'
import { MessageWithChat } from '@/types/messageType'
import { socket } from '@/utils/socket'
import { useQueryClient } from '@tanstack/react-query'
import { ReactNode, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

type EventProviderProp = {
  children: ReactNode
}

const EventProvider = ({ children }: EventProviderProp) => {
  const navigate = useNavigate()
  const { chatId } = useParams()
  const queryClient = useQueryClient()
  const auth = useAppSelector(selectAuth)

  const handleAddFriend = (friend: Friend) => {
    const redirectUrl = `/friends${
      chatId ? `/${chatId}` : ''
    }?tab=friend-request`

    if (typeof friend.userFromId !== 'string') {
      toast.info(`${friend.userFromId.fullName} đã gửi lời mời kết bạn cho bạn`)
    }
    navigate(redirectUrl)
  }

  const handleAcceptFriend = (friend: Friend) => {
    const redirectUrl = `/chats${chatId ? `/${chatId}` : ''}`

    if (typeof friend.userToId !== 'string') {
      toast.info(
        `${friend.userToId.fullName} đã chấp nhận lời mời kết bạn của bạn`
      )
    }
    navigate(redirectUrl)
  }

  const handleCreateGroup = (chat: Chat) => {
    queryClient.refetchQueries({
      queryKey: [ChatKey, 'all'],
    })

    toast.info(`${chat.groupAdmin?.fullName} đã tạo nhóm ${chat.name}`)
  }

  const handleAddToGroup = (chat: Chat, userAdd: Auth) => {
    queryClient.refetchQueries({
      queryKey: [ChatKey, 'all'],
    })

    toast.info(
      `${chat.groupAdmin?.fullName} đã thêm ${
        userAdd._id === auth.user._id ? 'bạn' : userAdd.fullName
      } vào nhóm ${chat.name}`
    )
  }

  const handleRemoveFromGroup = (chat: Chat, userRemove: Auth) => {
    if (userRemove._id === auth.user._id) {
      if (chatId === chat._id) {
        navigate('/')
      }
    }

    queryClient.refetchQueries({
      queryKey: [ChatKey],
    })

    toast.info(
      `${chat.groupAdmin?.fullName} đã xóa ${
        userRemove._id === auth.user._id ? 'bạn' : userRemove.fullName
      } ra khỏi nhóm ${chat.name}`
    )
  }

  const handleOutGroup = (chat: Chat, userOut: Auth) => {
    queryClient.refetchQueries({
      queryKey: [ChatKey],
    })

    toast.info(`${userOut.fullName} đã rời khỏi nhóm ${chat.name}`)
  }

  const handleReceiveMessage = (chatId: string, message: MessageWithChat) => {
    if (message.sender._id === auth.user._id) {
      return
    }

    queryClient.refetchQueries({
      queryKey: [ChatKey, 'all'],
    })

    if (chatId === message.chat._id) {
      queryClient.refetchQueries({
        queryKey: [ChatKey, 'messages', chatId],
      })
      return
    }

    toast.info(
      `${message.sender.fullName} Đã nhắn tin cho ${
        message.chat.isGroup ? message.chat.name : 'bạn'
      }`
    )
  }

  const handleRemoveMessage = (chatId: string, message: MessageWithChat) => {
    if (message.sender._id === auth.user._id) {
      return
    }

    queryClient.refetchQueries({
      queryKey: [ChatKey, 'all'],
    })

    if (chatId === message.chat._id) {
      queryClient.refetchQueries({
        queryKey: [ChatKey, 'messages', chatId],
      })
    }
  }

  useEffect(() => {
    const onReceiveMessage = (message: MessageWithChat) => {
      handleReceiveMessage(chatId!, message)
    }

    const onRemoveMessage = (message: MessageWithChat) => {
      handleRemoveMessage(chatId!, message)
    }
    if (auth) {
      socket.on(FriendEvent.ADD, handleAddFriend)
      socket.on(FriendEvent.ACCEPT, handleAcceptFriend)
      socket.on(ChatEvent.CREATE_GROUP, handleCreateGroup)
      socket.on(ChatEvent.ADD_TO_GROUP, handleAddToGroup)
      socket.on(ChatEvent.REMOVE_FROM_GROUP, handleRemoveFromGroup)
      socket.on(ChatEvent.OUT_FROM_GROUP, handleOutGroup)
      socket.on(MessageEvent.NEW, onReceiveMessage)
      socket.on(MessageEvent.DELETE, onRemoveMessage)
    }

    return () => {
      socket.off(FriendEvent.ADD, handleAddFriend)
      socket.off(FriendEvent.ACCEPT, handleAcceptFriend)
      socket.off(ChatEvent.CREATE_GROUP, handleCreateGroup)
      socket.off(ChatEvent.ADD_TO_GROUP, handleAddToGroup)
      socket.off(ChatEvent.REMOVE_FROM_GROUP, handleRemoveFromGroup)
      socket.off(ChatEvent.OUT_FROM_GROUP, handleOutGroup)
      socket.off(MessageEvent.NEW, onReceiveMessage)
      socket.off(MessageEvent.DELETE, onRemoveMessage)
    }
  }, [auth, chatId])

  return <>{children}</>
}

export default EventProvider
