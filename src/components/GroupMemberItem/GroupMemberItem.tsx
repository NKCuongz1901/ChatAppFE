import { Auth } from '@/types/authType'
import { FC, memo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import ChatServices, { ChatKey } from '@/services/chatServices'
import { alertErrorAxios } from '@/utils/alert'

type GroupMemberItemProp = {
  user: Auth
  isAdmin: boolean
}

const GroupMemberItem: FC<GroupMemberItemProp> = memo(({ user, isAdmin }) => {
  const { chatId } = useParams()
  const queryClient = useQueryClient()

  const handleRemoveMember = async (userId: string) => {
    try {
      await ChatServices.removeFromGroup(chatId!, {
        userId: userId,
      })

      queryClient.refetchQueries({
        queryKey: [ChatKey, 'get', chatId],
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
        <AvatarFallback className="font-bold">
          {user?.fullName.split(' ').pop()?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1 w-full">
        <span className="font-semibold text-base">{user?.fullName}</span>
        <div className="flex justify-end w-full">
          {isAdmin && (
            <Button
              variant={'destructive'}
              size={'sm'}
              onClick={() => handleRemoveMember(user._id)}
            >
              Xóa
            </Button>
          )}
        </div>
      </div>
    </div>
  )
})

export default GroupMemberItem
