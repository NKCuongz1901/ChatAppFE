import { useAppSelector } from '@/app/hooks'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { selectAuth } from '@/features/auth/authSlice'
import { Chat } from '@/types/chatType'
import { showLastMessage } from '@/utils/utils'
import { FC, memo } from 'react'
import { Link, useParams } from 'react-router-dom'

type ChatItemProp = {
  chat: Chat
}

const ChatItem: FC<ChatItemProp> = memo(({ chat }) => {
  const { chatId } = useParams()
  const auth = useAppSelector(selectAuth)
  const chatUsers = chat.users.filter((user) => user._id !== auth.user._id)
  const latestMessageSender =
    chat?.latestMessage?.sender?._id === auth.user._id
      ? 'Bạn'
      : chat?.latestMessage?.sender?.fullName

  return (
    <Link
      to={`/chats/${chat._id}`}
      key={chat._id}
      className={`justify-start gap-4 flex w-full
                hover:bg-accent hover:text-accent-foreground
                p-2 px-4 rounded-md overflow-hidden
                ${
                  chatId &&
                  chatId === chat._id &&
                  `bg-accent text-accent-foreground`
                }
              `}
    >
      <Avatar className="flex justify-center items-center rounded-full border w-12 h-12">
        {!chat.isGroup && (
          <AvatarImage
            src={chatUsers[0]?.avatar?.url}
            alt={chatUsers[0]?.fullName}
            className="w-12 h-12"
          />
        )}
        <AvatarFallback className="font-bold">
          {chatUsers.map((chatUser) =>
            chatUser.fullName.split(' ').pop()?.charAt(0).toUpperCase()
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-base">
          {chat.groupAdmin ? chat.name : chatUsers[0].fullName}
        </span>
        {chat.latestMessage && (
          <span className="text-zinc-500 text-xs truncate flex gap-1">
            <span>{latestMessageSender}:</span>
            <span>{showLastMessage(chat.latestMessage)}</span>
          </span>
        )}
      </div>
    </Link>
  )
})

export default ChatItem
