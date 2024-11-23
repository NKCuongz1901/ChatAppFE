import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import ChatServices, { ChatKey } from '@/services/chatServices'
import { useParams } from 'react-router-dom'
import { Chat } from '@/types/chatType'
import { useAppSelector } from '@/app/hooks'
import { selectAuth } from '@/features/auth/authSlice'
import { Button } from '../ui/button'
import { Info } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import GroupMembers from '../GroupMembers'

const ChatTopbar = () => {
  const { chatId } = useParams()
  const auth = useAppSelector(selectAuth)

  const {
    data: chatResponse,
    isSuccess,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: [ChatKey, 'get', chatId],
    queryFn: () => ChatServices.get(chatId!),
    refetchOnMount: true,
  })

  const chat: Chat = chatResponse?.data

  const chatUsers = chat?.users?.filter((user) => user._id !== auth.user._id)

  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
      {(isFetching || isPending) && !isSuccess && (
        <div className="flex items-center space-x-4 px-4 p-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] max-w-full" />
          </div>
        </div>
      )}
      {isSuccess && chatUsers && (
        <div className="flex items-center gap-2">
          <Avatar className="flex justify-center items-center w-12 h-12">
            {!chat.isGroup && (
              <AvatarImage
                src={chatUsers[0]?.avatar?.url}
                alt={chatUsers[0]?.fullName}
                className="w-12 h-12"
              />
            )}
            {chat.isGroup && (
              <AvatarImage src={''} alt={chat.name} className="w-12 h-12" />
            )}
            <AvatarFallback className="font-bold">
              {chatUsers.map((chatUser) =>
                chatUser.fullName.split(' ').pop()?.charAt(0).toUpperCase()
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">
              {chat.groupAdmin ? chat.name : chatUsers[0].fullName}
            </span>
          </div>
        </div>
      )}

      <GroupMembers>
        <Button variant="ghost" size="icon">
          <Info size={20} className="text-muted-foreground" />
        </Button>
      </GroupMembers>
    </div>
  )
}

export default ChatTopbar
