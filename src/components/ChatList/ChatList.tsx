import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Message } from '@/types/messageType'
import { useAppSelector } from '@/app/hooks'
import { selectAuth } from '@/features/auth/authSlice'
import ChatServices, { ChatKey } from '@/services/chatServices'
import MessageItem from '../MessageItem'
import MessageItemSkeleton from '../MessageItemSkeleton'
import ChatBottombar from '../ChatBottombar'

const ChatList = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const { chatId } = useParams()
  const auth = useAppSelector(selectAuth)

  const {
    data: messagesResponse,
    isSuccess,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: [ChatKey, 'messages', chatId],
    queryFn: () => ChatServices.messages(chatId!),
  })

  const messages: Message[] = messagesResponse?.data

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight
      }
    }, 1000)
  }, [messages])

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        {(isPending || isFetching) &&
          !isSuccess &&
          Array(10)
            .fill(0)
            .map((val, index) => (
              <MessageItemSkeleton
                key={`${val}-${index}`}
                duration={index * 0.05 + 0.2}
              />
            ))}
        {isSuccess && (
          <AnimatePresence>
            {messages?.map((message, index) => (
              <MessageItem
                key={message._id}
                duration={index * 0.05 + 0.2}
                message={message}
                user={auth.user}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
      <ChatBottombar />
    </div>
  )
}

export default ChatList
