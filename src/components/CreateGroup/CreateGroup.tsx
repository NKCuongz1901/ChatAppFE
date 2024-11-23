import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, memo, ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import CreateGroupUsers from '../CreateGroupUsers'
import { alertErrorAxios } from '@/utils/alert'
import ChatServices, { ChatKey } from '@/services/chatServices'
import { useQueryClient } from '@tanstack/react-query'
import { Chat } from '@/types/chatType'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  users: z.array(z.string()),
  name: z.string(),
})

type CreateGroupProp = {
  children: ReactNode
}

const CreateGroup: FC<CreateGroupProp> = memo(({ children }) => {
  const [load, setLoad] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      users: [],
    },
  })

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoad(true)
      const chatResponse = await ChatServices.createGroup(values)

      queryClient.refetchQueries({
        queryKey: [ChatKey, 'all'],
      })

      const chat: Chat = chatResponse.data

      navigate(`/chats/${chat._id}`)
    } catch (error) {
      alertErrorAxios(error)
    } finally {
      setLoad(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo nhóm</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên nhóm</FormLabel>
                    <FormControl>
                      <Input placeholder="tên nhóm..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CreateGroupUsers form={form} />
              <Button type="submit" disabled={load}>
                Tạo nhóm
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
})

export default CreateGroup
