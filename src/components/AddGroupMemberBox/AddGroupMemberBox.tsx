import FriendServices, { FriendKey } from '@/services/friendServices'
import { Friend } from '@/types/friendType'
import { useQuery } from '@tanstack/react-query'
import { ScrollArea } from '../ui/scroll-area'
import AddGroupMemberItem from '../AddGroupMemberItem'
import BarItemSkeleton from '../BarItemSkeleton'
import { Auth } from '@/types/authType'

type AddGroupMemberBoxProp = {
  members: Auth[]
}
const AddGroupMemberBox = ({ members }: AddGroupMemberBoxProp) => {
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
    <div className="space-y-1 leading-none">
      <ScrollArea className="h-[350px] rounded-md border p-4">
        {isSuccess &&
          friends.map((friend) => (
            <AddGroupMemberItem
              friend={friend}
              members={members}
              key={friend._id}
            />
          ))}
        {(isPending || isFetching) &&
          !isSuccess &&
          Array(5)
            .fill(0)
            .map((val, index) => <BarItemSkeleton key={`${val}-${index}`} />)}
      </ScrollArea>
    </div>
  )
}

export default AddGroupMemberBox
