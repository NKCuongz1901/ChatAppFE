import { SquarePen } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useQuery } from '@tanstack/react-query'
import ChatServices, { ChatKey } from '@/services/chatServices'
import { Chat } from '@/types/chatType'
import ChatItem from '../ChatItem'
import BarItemSkeleton from '../BarItemSkeleton'
import CreateGroup from '../CreateGroup'
import { ScrollArea } from '../ui/scroll-area'

function Chatbar() {
  const {
    data: chatsResponse,
    isSuccess,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: [ChatKey, 'all'],
    queryFn: ChatServices.all,
    refetchOnMount: true,
  })

  const chats: Chat[] = chatsResponse?.data
  return (
    <>
      <div className="flex justify-between p-2 items-center">
        <div className="flex gap-2 items-center text-2xl">
          <p className="font-medium">Chats</p>
          <span className="text-zinc-300">({isSuccess && chats.length})</span>
        </div>

        <div>
          <CreateGroup>
            <Button variant="secondary" size="icon">
              <SquarePen size={20} />
            </Button>
          </CreateGroup>
        </div>
      </div>

      {/* xử lý chống tràng */}
      <ScrollArea className="max-h-full">
        <nav className="grid gap-1 px-2">
          {isSuccess &&
            chats.map((chat) => <ChatItem key={chat._id} chat={chat} />)}
          {(isPending || isFetching) &&
            !isSuccess &&
            Array(5)
              .fill(0)
              .map((val, index) => <BarItemSkeleton key={`${val}-${index}`} />)}
        </nav>
      </ScrollArea>
    </>
  )
}

export default Chatbar
