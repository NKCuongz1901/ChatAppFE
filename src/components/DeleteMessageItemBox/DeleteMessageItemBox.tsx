import { Message } from '@/types/messageType'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { alertErrorAxios } from '@/utils/alert'
import MessageServices from '@/services/messageServices'
import { useQueryClient } from '@tanstack/react-query'
import { ChatKey } from '@/services/chatServices'
import { useParams } from 'react-router-dom'
import { useState } from 'react'

type DeleteMessageItemBoxProp = {
  message: Message
}

const DeleteMessageItemBox = ({ message }: DeleteMessageItemBoxProp) => {
  const { chatId } = useParams()
  const queryClient = useQueryClient()
  const [load, setLoad] = useState(false)

  const handleDeleteMessage = async () => {
    try {
      setLoad(true)
      await MessageServices.delete(message._id)
      queryClient.refetchQueries({
        queryKey: [ChatKey, 'messages', chatId],
      })

      queryClient.refetchQueries({
        queryKey: [ChatKey, 'all'],
      })
    } catch (error) {
      alertErrorAxios(error)
    } finally {
      setLoad(false)
    }
  }
  return (
    <Button
      variant={'outline'}
      size={'icon'}
      onClick={handleDeleteMessage}
      disabled={load}
    >
      <Trash2 size={20} />
    </Button>
  )
}

export default DeleteMessageItemBox
