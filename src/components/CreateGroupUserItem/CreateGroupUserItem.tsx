import { useAppSelector } from '@/app/hooks'
import { selectAuth } from '@/features/auth/authSlice'
import { Auth } from '@/types/authType'
import { Friend } from '@/types/friendType'
import { FC, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'
import { FormControl, FormItem, FormLabel } from '../ui/form'

type CreateGroupUserItemProp = {
  friend: Friend
  field: ControllerRenderProps<
    {
      users: string[]
      name: string
    },
    'users'
  >
  form: UseFormReturn<
    {
      users: string[]
      name: string
    },
    any,
    undefined
  >
}
const CreateGroupUserItem: FC<CreateGroupUserItemProp> = ({
  friend,
  field,
  form,
}) => {
  const [friendUser, setFriendUser] = useState<Auth>()
  const auth = useAppSelector(selectAuth)

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

  return (
    <div
      className={`justify-start gap-4 flex w-full
        hover:bg-accent hover:text-accent-foreground
        p-2 px-4 rounded-md
      `}
    >
      {friendUser && (
        <FormItem className="flex w-full h-full items-center gap-5">
          <FormControl>
            <Checkbox
              checked={field.value.includes(friendUser._id)}
              onCheckedChange={(checked) => {
                const value = field.value
                if (checked) {
                  form.setValue('users', [...value, friendUser._id])
                } else {
                  const newValue = value.filter(
                    (userId) => userId !== friendUser._id
                  )
                  form.setValue('users', newValue)
                }
              }}
            />
          </FormControl>
          <FormLabel className="block w-full">
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
              <span className="font-semibold text-base">
                {friendUser?.fullName}
              </span>
            </div>
          </FormLabel>
        </FormItem>
      )}
    </div>
  )
}

export default CreateGroupUserItem
