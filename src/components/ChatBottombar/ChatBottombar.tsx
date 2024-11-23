import { useRef, useState } from 'react'
import { Button, buttonVariants } from '../ui/button'
import { FileImage, Paperclip, SendHorizontal } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { Textarea } from '../ui/textarea'
import EmojiPicker from '../EmojiPicker'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { cn } from '@/utils/utils'
import UploadServices from '@/services/uploadServices'
import PathUploadFile from '@/constants/uploads/uploadPath'
import { alertErrorAxios } from '@/utils/alert'
import MessageServices from '@/services/messageServices'
import { useParams } from 'react-router-dom'
import MessageTypeEnum from '@/constants/messages/MessageTypeEnum'
import { useQueryClient } from '@tanstack/react-query'
import { ChatKey } from '@/services/chatServices'

const ChatBottombar = () => {
  const { chatId } = useParams()
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const rows = message.split('\n').length

  const queryClient = useQueryClient()

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }

  const handleSendText = async () => {
    if (message.trim()) {
      // send message
      await MessageServices.create({
        chatId: chatId!,
        content: message.trim(),
        type: MessageTypeEnum.TEXT,
      })

      queryClient.refetchQueries({
        queryKey: [ChatKey, 'messages', chatId],
      })

      queryClient.refetchQueries({
        queryKey: [ChatKey, 'all'],
      })

      setMessage('')

      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const handleSendFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    try {
      const fileResponse = await UploadServices.uploadSingle(
        PathUploadFile.MESSAGE_FILE,
        e.target.files[0]
      )
      await MessageServices.create({
        chatId: chatId!,
        content: fileResponse.data,
        type: MessageTypeEnum.FILE,
      })

      queryClient.refetchQueries({
        queryKey: [ChatKey, 'messages', chatId],
      })

      queryClient.refetchQueries({
        queryKey: [ChatKey, 'all'],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }
  const handleSendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    try {
      const fileResponse = await UploadServices.uploadSingle(
        PathUploadFile.MESSAGE_IMAGE,
        e.target.files[0]
      )

      await MessageServices.create({
        chatId: chatId!,
        content: fileResponse.data,
        type: MessageTypeEnum.IMAGE,
      })

      queryClient.refetchQueries({
        queryKey: [ChatKey, 'messages', chatId],
      })

      queryClient.refetchQueries({
        queryKey: [ChatKey, 'all'],
      })
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendText()
    }
  }

  return (
    <div className="p-2 flex justify-between w-full items-center">
      {!message.trim() && (
        <div className="flex gap-3 mr-6">
          <Label
            className={cn(
              buttonVariants({ variant: 'outline', size: 'icon' }),
              'h-9 w-9 cursor-pointer'
            )}
            htmlFor="upload-image-btn"
          >
            <Input
              id="upload-image-btn"
              accept="image/*"
              type="file"
              className="hidden"
              onChange={handleSendImage}
            />
            <FileImage size={20} className="text-muted-foreground" />
          </Label>
          <Label
            className={cn(
              buttonVariants({ variant: 'outline', size: 'icon' }),
              'h-9 w-9 cursor-pointer'
            )}
            htmlFor="upload-file-btn"
          >
            <Input
              id="upload-file-btn"
              type="file"
              className="hidden"
              onChange={handleSendFile}
            />
            <Paperclip size={20} className="text-muted-foreground" />
          </Label>
        </div>
      )}

      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: 'spring',
              bounce: 0.15,
            },
          }}
        >
          <>
            <Textarea
              autoComplete="off"
              value={message}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              rows={rows}
              name="message"
              placeholder="Aa"
              className="px-4 w-full border rounded-3xl flex items-center min-h-9 resize-none overflow-hidden bg-background"
            ></Textarea>
            <div className="absolute right-[1px] bottom-1/2 translate-y-1/2">
              <EmojiPicker
                onChange={(emoji) => {
                  setMessage(message + emoji)
                  // if (inputRef.current) {
                  //   inputRef.current.focus()
                  // }
                }}
              />
            </div>
          </>
        </motion.div>

        {message.trim() && (
          <Button
            onClick={handleSendText}
            variant={'ghost'}
            className="rounded-full w-10 h-10 p-1 mx-2"
          >
            <SendHorizontal />
          </Button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatBottombar
