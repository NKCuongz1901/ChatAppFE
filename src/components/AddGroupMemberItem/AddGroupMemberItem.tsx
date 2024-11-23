import { useAppSelector } from '@/app/hooks'
import { selectAuth } from '@/features/auth/authSlice'
import { Friend } from '@/types/friendType'
import { FC, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Auth } from '@/types/authType'
import { alertErrorAxios } from '@/utils/alert'
import ChatServices, { ChatKey } from '@/services/chatServices'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { FriendKey } from '@/services/friendServices'

type AddGroupMemberItemProp = {
  friend: Friend
  members: Auth[]
}

const AddGroupMemberItem: FC<AddGroupMemberItemProp> = ({
  friend,
  members,
}) => {
  const { chatId } = useParams()
  const [friendUser, setFriendUser] = useState<Auth>()
  const auth = useAppSelector(selectAuth)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (typeof friend.userFromId !== 'string') {
      if (friend.userFromId._id !== auth.user._id) {
        setFriendUser(friend.userFromId)
      }
    }
    if (typeof friend.userToId !== 'string') {
      if (friend.userToId._id !== auth.user._id) {
        setFriendUser(friend.userToId)
      }
    }
  }, [friend])

  const handleAddMember = async (userId: string) => {
    try {
      await ChatServices.addToGroup(chatId!, {
        userId: userId,
      })

      queryClient.refetchQueries({
        queryKey: [FriendKey],
      })
      queryClient.refetchQueries({
        queryKey: [ChatKey, 'get', chatId],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  if (friendUser && members.some((member) => member._id === friendUser._id)) {
    return <></>
  }

  return (
    <div
      className={`justify-start gap-4 flex
        w-full
        hover:bg-accent hover:text-accent-foreground
        p-2 px-4 rounded-md
      `}
    >
      <Avatar className="flex justify-center items-center rounded-full border w-12 h-12">
        {friendUser && (
          <AvatarImage
            src={friendUser.avatar?.url}
            alt={friendUser.fullName}
            className="w-12 h-12"
          />
        )}
        <AvatarFallback className="font-bold">
          {friendUser?.fullName.split(' ').pop()?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 w-full">
        <span className="font-semibold text-base">{friendUser?.fullName}</span>

        <div className="flex justify-end">
          <Button size={'sm'} onClick={() => handleAddMember(friendUser?._id!)}>
            Thêm
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddGroupMemberItem
