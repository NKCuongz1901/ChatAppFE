import { useAppSelector } from '@/app/hooks'
import { selectAuth } from '@/features/auth/authSlice'
import { Auth } from '@/types/authType'
import { Friend } from '@/types/friendType'
import { FC, memo, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import FriendTypeEnum from '@/constants/friends/FriendTypeEnum'
import { Button } from '../ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import FriendServices, { FriendKey } from '@/services/friendServices'
import { toast } from 'react-toastify'
import { alertErrorAxios } from '@/utils/alert'

type FriendItemProp = {
  friend: Friend
}

const FriendItem: FC<FriendItemProp> = memo(({ friend }) => {
  const [friendUser, setFriendUser] = useState<Auth>()
  const auth = useAppSelector(selectAuth)

  const acceptFriendMutation = useMutation({
    mutationFn: FriendServices.accept,
  })

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

  const handleAcceptFriend = async (id: string) => {
    try {
      const response = await acceptFriendMutation.mutateAsync(id)
      toast.success(response.data.message)
      queryClient.refetchQueries({
        queryKey: [FriendKey, 'requests'],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div
      className={`justify-start gap-4 flex w-full
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
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-base">{friendUser?.fullName}</span>
        {friend.status === FriendTypeEnum.REQUEST
          ? 'Đã gửi lời mời kết bạn cho bạn'
          : 'Bạn bè'}
        {friend.status === FriendTypeEnum.REQUEST && (
          <div className="flex justify-end">
            <Button
              size={'sm'}
              onClick={() => {
                handleAcceptFriend(friendUser?._id!)
              }}
            >
              Chấp nhận
            </Button>
          </div>
        )}
      </div>
    </div>
  )
})

export default FriendItem
