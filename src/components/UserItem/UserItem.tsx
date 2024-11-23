import { useAppSelector } from '@/app/hooks'
import { selectAuth } from '@/features/auth/authSlice'
import { FC, memo, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import FriendTypeEnum from '@/constants/friends/FriendTypeEnum'
import { UserWithFriend } from '@/types/userType'
import { Button } from '../ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import FriendServices from '@/services/friendServices'
import { alertErrorAxios } from '@/utils/alert'
import { toast } from 'react-toastify'
import { UserKey } from '@/services/userServices'

type UserItemProp = {
  user: UserWithFriend
}

const UserItem: FC<UserItemProp> = memo(({ user }) => {
  const auth = useAppSelector(selectAuth)
  const [friendStatusText, setFriendStatusText] = useState('')

  const addFriendMutation = useMutation({
    mutationFn: FriendServices.add,
  })

  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user.friend) {
      return
    }
    if (user.friend.status === FriendTypeEnum.CONNECT) {
      setFriendStatusText('Bạn bè')
      return
    }
    if (auth.user._id === user.friend.userFromId) {
      setFriendStatusText('Đã gửi lời mời kết bạn')
    }
    setFriendStatusText('Chờ bạn xác nhận')
  }, [user])

  const handleAddFriend = async (id: string) => {
    try {
      const response = await addFriendMutation.mutateAsync(id)
      toast.success(response.data.message)
      queryClient.refetchQueries({
        queryKey: [UserKey],
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
        <AvatarImage
          src={user.avatar?.url}
          alt={user.fullName}
          className="w-12 h-12"
        />

        <AvatarFallback>
          <span className="font-bold text-base">
            {user?.fullName.split(' ').pop()?.charAt(0).toUpperCase()}
          </span>
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 w-full">
        <span className="font-semibold">{user?.fullName}</span>
        {user.friend && friendStatusText}
        {!user.friend && (
          <div className="flex justify-end">
            <Button size={'sm'} onClick={() => handleAddFriend(user._id)}>
              Thêm bạn
            </Button>
          </div>
        )}
      </div>
    </div>
  )
})

export default UserItem
