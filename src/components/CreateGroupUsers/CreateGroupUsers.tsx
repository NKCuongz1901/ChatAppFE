import FriendServices, { FriendKey } from '@/services/friendServices'
import { Friend } from '@/types/friendType'
import { useQuery } from '@tanstack/react-query'
import BarItemSkeleton from '../BarItemSkeleton'
import CreateGroupUserItem from '../CreateGroupUserItem'
import { FormField } from '../ui/form'
import { UseFormReturn } from 'react-hook-form'
import { ScrollArea } from '@/components/ui/scroll-area'

type CreateGroupUsersProp = {
  form: UseFormReturn<
    {
      users: string[]
      name: string
    },
    any,
    undefined
  >
}
const CreateGroupUsers = ({ form }: CreateGroupUsersProp) => {
  const {
    data: friendsResponse,
    isSuccess,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: [FriendKey],
    queryFn: FriendServices.all,
    refetchOnMount: true,
  })

  const friends: Friend[] = friendsResponse?.data
  return (
    <FormField
      control={form.control}
      name="users"
      render={({ field }) => (
        <div className="space-y-1 leading-none">
          <ScrollArea className="h-[350px] rounded-md border p-4">
            {isSuccess &&
              friends.map((friend) => (
                <CreateGroupUserItem
                  key={friend._id}
                  friend={friend}
                  field={field}
                  form={form}
                />
              ))}
            {(isPending || isFetching) &&
              !isSuccess &&
              Array(5)
                .fill(0)
                .map((val, index) => (
                  <BarItemSkeleton key={`${val}-${index}`} />
                ))}
          </ScrollArea>
        </div>
      )}
    />
  )
}

export default CreateGroupUsers
