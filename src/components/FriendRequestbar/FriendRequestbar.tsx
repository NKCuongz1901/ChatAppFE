import { useQuery } from '@tanstack/react-query'
import { Friend } from '@/types/friendType'
import FriendItem from '../FriendItem'
import FriendServices, { FriendKey } from '@/services/friendServices'
import BarItemSkeleton from '../BarItemSkeleton'

function FriendRequestbar() {
  const {
    data: friendsResponse,
    isSuccess,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: [FriendKey, 'requests'],
    queryFn: FriendServices.requests,
    refetchOnMount: true,
  })

  const friends: Friend[] = friendsResponse?.data
  return (
    <nav className="grid gap-1 px-2">
      {isSuccess &&
        friends.map((friend) => (
          <FriendItem key={friend._id} friend={friend} />
        ))}
      {(isPending || isFetching) &&
        !isSuccess &&
        Array(5)
          .fill(0)
          .map((val, index) => <BarItemSkeleton key={`${val}-${index}`} />)}
    </nav>
  )
}

export default FriendRequestbar
