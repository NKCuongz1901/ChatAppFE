import { ArrowLeft, X } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import UserServices, { UserKey } from '@/services/userServices'
import { UserWithFriend } from '@/types/userType'
import UserItem from '../UserItem'
import BarItemSkeleton from '../BarItemSkeleton'

type FindUserbarProp = {
  onBack: () => void
}
const FindUserbar = ({ onBack }: FindUserbarProp) => {
  const [hideX, setHideX] = useState(true)
  const [key, setKey] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const {
    data: usersResponse,
    isSuccess,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: [UserKey, key],
    queryFn: () => UserServices.all(key),
    refetchOnMount: true,
  })

  const friends: UserWithFriend[] = usersResponse?.data

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value)
    if (e.target.value !== '') {
      setHideX(false)
    } else {
      setHideX(true)
    }
  }

  const handleClear = () => {
    setKey('')
    setHideX(true)
    searchRef.current?.focus()
  }

  return (
    <div>
      <div className="flex gap-3 items-center p-2 relative">
        <Button
          variant={'ghost'}
          size={'icon'}
          className="hover:bg-inherit"
          onClick={onBack}
        >
          <ArrowLeft />
        </Button>
        <Input
          className="outline-none rounded-full px-5"
          onChange={handleChange}
          value={key}
          ref={searchRef}
        />
        <Button
          variant={'ghost'}
          size={'icon'}
          className={`rounded-full flex absolute right-[0.6rem] ${
            hideX && 'hidden'
          }`}
          onClick={handleClear}
        >
          <X size={15} />
        </Button>
      </div>

      <nav className="grid gap-1 px-2">
        {isSuccess &&
          friends.map((user) => <UserItem key={user._id} user={user} />)}
        {(isPending || isFetching) &&
          !isSuccess &&
          Array(5)
            .fill(0)
            .map((val, index) => <BarItemSkeleton key={`${val}-${index}`} />)}
      </nav>
    </div>
  )
}

export default FindUserbar
