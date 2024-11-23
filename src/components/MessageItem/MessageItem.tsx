import { Message } from '@/types/messageType'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { cn } from '@/utils/utils'
import { motion } from 'framer-motion'
import { FC, memo, useState } from 'react'
import { Auth } from '@/types/authType'
import MessageContent from '../MessageContent'
import DeleteMessageItemBox from '../DeleteMessageItemBox'

type MessageItemProp = {
  message: Message
  duration: number
  user: Auth
}

const MessageItem: FC<MessageItemProp> = memo(({ message, duration, user }) => {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
      transition={{
        opacity: { duration: 0.1 },
        layout: {
          type: 'spring',
          bounce: 0.3,
          duration: duration,
        },
      }}
      style={{
        originX: 0.5,
        originY: 0.5,
      }}
      className={cn(
        'flex flex-col gap-2 p-4 whitespace-pre-wrap',
        message.sender._id === user._id ? 'items-end' : 'items-start'
      )}
      onHoverStart={() => {
        setShowDelete(true)
      }}
      onHoverEnd={() => {
        setShowDelete(false)
      }}
    >
      <div className="flex gap-3 items-end">
        {message.sender._id === user._id && showDelete && (
          <DeleteMessageItemBox message={message} />
        )}
        {message.sender._id !== user._id && (
          <Avatar className="flex justify-center items-center border">
            <AvatarImage
              src={message.sender.avatar?.url}
              alt={message.sender.fullName}
              width={6}
              height={6}
            />
            <AvatarFallback className="font-bold">
              {message.sender.fullName
                .split(' ')
                .pop()
                ?.charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}

        <MessageContent
          isAuth={message.sender._id === user._id}
          message={message}
        />

        {message.sender._id === user._id && (
          <Avatar className="flex justify-center items-center border">
            <AvatarImage
              src={message.sender.avatar?.url}
              alt={message.sender.fullName}
              width={6}
              height={6}
            />
            <AvatarFallback className="font-bold">
              {message.sender.fullName
                .split(' ')
                .pop()
                ?.charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </motion.div>
  )
})

export default MessageItem
