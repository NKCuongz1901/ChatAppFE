import { useNavigate, useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useAppSelector } from '@/app/hooks'
import { selectAuth } from '@/features/auth/authSlice'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ChatServices, { ChatKey } from '@/services/chatServices'
import { Chat } from '@/types/chatType'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { FC, Fragment, memo, ReactNode, useState } from 'react'
import GroupMemberItem from '../GroupMemberItem'
import AddGroupMemberBox from '../AddGroupMemberBox'
import { ScrollArea } from '../ui/scroll-area'
import { Button } from '../ui/button'
import { alertErrorAxios } from '@/utils/alert'
import { toast } from 'react-toastify'

type GroupMembersProp = {
  children: ReactNode
}

const GroupMembers: FC<GroupMembersProp> = memo(({ children }) => {
  const { chatId } = useParams()
  const auth = useAppSelector(selectAuth)
  const [load, setLoad] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: chatResponse, isSuccess } = useQuery({
    queryKey: [ChatKey, 'get', chatId],
    queryFn: () => ChatServices.get(chatId!),
    refetchOnMount: true,
  })

  const handleOutGroup = async () => {
    try {
      setLoad(true)
      await ChatServices.removeFromGroup(chatId!, { userId: auth.user._id })
      navigate('/')
      queryClient.refetchQueries({
        queryKey: [ChatKey, 'all'],
      })
      toast.success(`Đã rời khỏi nhóm`)
    } catch (error) {
      alertErrorAxios(error)
    } finally {
      setLoad(false)
    }
  }

  const chat: Chat = chatResponse?.data
  return (
    <div className="flex">
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          {isSuccess && (
            <>
              <Tabs defaultValue="member" className="flex-1">
                <TabsList>
                  <TabsTrigger value="member">Thành viên</TabsTrigger>
                  {auth.user._id === chat.groupAdmin?._id && (
                    <TabsTrigger value="add-member">
                      Thêm thành viên
                    </TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="member">
                  <ScrollArea className="h-[350px] rounded-md border p-4">
                    {chat.users.map((member) => {
                      if (member._id === auth.user._id) {
                        return <Fragment key={member._id}></Fragment>
                      }
                      return (
                        <GroupMemberItem
                          key={member._id}
                          isAdmin={chat.groupAdmin?._id === auth.user._id}
                          user={member}
                        />
                      )
                    })}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="add-member">
                  <AddGroupMemberBox members={chat.users} />
                </TabsContent>
              </Tabs>
              {chat.isGroup && chat.groupAdmin?._id !== auth.user._id && (
                <Button
                  variant={'destructive'}
                  size={'sm'}
                  onClick={handleOutGroup}
                  disabled={load}
                >
                  Rời khỏi nhóm
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default GroupMembers
