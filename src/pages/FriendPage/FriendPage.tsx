import FindUserbar from '@/components/FindUserbar'
import Friendbar from '@/components/Friendbar'
import FriendRequestbar from '@/components/FriendRequestbar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useQueryParams from '@/hooks/useQueryParams'
import { useLayoutEffect, useState } from 'react'

const FriendPage = () => {
  const [friendTab, setFriendTab] = useState('friend')
  const [tab, setTab] = useState('friend')

  const param = useQueryParams()

  useLayoutEffect(() => {
    setFriendTab(param.tab === 'friend-request' ? 'friend-request' : 'friend')
    if (param.tab === 'friend-request') {
      setTab('friend')
    }
  }, [param.tab])

  const onFindClick = () => {
    setTab('find')
  }

  return (
    <div>
      {tab === 'friend' && (
        <>
          <div className="w-full p-2 px-4">
            <Button
              onClick={onFindClick}
              variant={'outline'}
              className="w-full rounded-full hover:bg-secondary/80 cursor-text bg-secondary/80"
            >
              Tìm kiếm...
            </Button>
          </div>
          <Tabs value={friendTab} className="w-full">
            <TabsList className="px-2 w-full">
              <TabsTrigger
                onClick={() => {
                  setFriendTab('friend')
                }}
                value="friend"
              >
                Bạn bè
              </TabsTrigger>
              <TabsTrigger
                onClick={() => {
                  setFriendTab('friend-request')
                }}
                value="friend-request"
              >
                Lời mời kết bạn
              </TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent value="friend">
                <Friendbar />
              </TabsContent>
              <TabsContent value="friend-request">
                <FriendRequestbar />
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}

      {tab === 'find' && (
        <FindUserbar
          onBack={() => {
            setTab('friend')
          }}
        />
      )}
    </div>
  )
}

export default FriendPage
