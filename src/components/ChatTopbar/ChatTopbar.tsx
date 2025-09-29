import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import ChatServices, { ChatKey } from '@/services/chatServices'
import { useParams } from 'react-router-dom'
import { Chat } from '@/types/chatType'
import { useAppSelector } from '@/app/hooks'
import { selectAuth } from '@/features/auth/authSlice'
import { Button } from '../ui/button'
import { Info, Video } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import GroupMembers from '../GroupMembers'
import { useWebRTC } from '@/hooks/useWebRTC'
import { useState } from 'react'
import VideoCallModal from '../VideoCallModal/VideoCallModal'

const ChatTopbar = () => {
  const { chatId } = useParams()
  const auth = useAppSelector(selectAuth)
  const {
    localStreamRef,
    remoteStream,
    incomingCaller,
    inCallWith,
    startCall,
    acceptCall,
    endCall,
  } = useWebRTC()
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] =
    useState<boolean>(false)

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
  const peerId = !chat?.isGroup ? chatUsers?.[0]?._id : undefined

  const onStartCall = async () => {
    if (!peerId) return
    await startCall({ selfId: auth.user._id, peerId })
    setIsVideoCallModalOpen(true)
  }

  const onAcceptCall = async () => {
    if (!incomingCaller) return
    await acceptCall(auth.user._id, incomingCaller)
    setIsVideoCallModalOpen(true)
  }

  const onEndCall = () => {
    if (!inCallWith) return
    endCall(auth.user._id)
    setIsVideoCallModalOpen(false)
  }

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

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onStartCall}
          disabled={!peerId}
        >
          <Video size={20} className="text-muted-foreground" />
        </Button>

        <GroupMembers>
          <Button variant="ghost" size="icon">
            <Info size={20} className="text-muted-foreground" />
          </Button>
        </GroupMembers>
      </div>

      {incomingCaller && !inCallWith && (
        <div className="absolute right-4 top-24 flex items-center gap-2 bg-white border rounded px-3 py-2 shadow">
          <span>Cuộc gọi đến</span>
          <Button onClick={onAcceptCall} size="sm">
            Chấp nhận
          </Button>
        </div>
      )}

      <VideoCallModal
        isOpen={isVideoCallModalOpen}
        localStream={localStreamRef.current}
        remoteStream={remoteStream}
        onClose={onEndCall}
      />
    </div>
  )
}

export default ChatTopbar
