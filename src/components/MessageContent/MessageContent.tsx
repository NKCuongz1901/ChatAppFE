import MessageTypeEnum from '@/constants/messages/MessageTypeEnum'
import { Message } from '@/types/messageType'
import { cn } from '@/utils/utils'

type MessageContentProp = {
  message: Message
  isAuth: boolean
}
const MessageContent = ({ message, isAuth }: MessageContentProp) => {
  switch (message.type) {
    case MessageTypeEnum.TEXT:
      return (
        <span
          className={cn(
            'bg-accent p-3 rounded-3xl max-w-xs',
            isAuth && 'text-primary-foreground bg-[#0084ff]'
          )}
        >
          {message.text}
        </span>
      )
    case MessageTypeEnum.FILE:
      return (
        <a
          className={cn(
            'bg-accent p-3 rounded-full max-w-xs font-semibold',
            isAuth && 'text-primary-foreground bg-[#0084ff]'
          )}
          href={message.file?.url}
          download
        >
          {message.file?.url.split('/').pop()}
        </a>
      )
    case MessageTypeEnum.EMOJI:
      return (
        <div className="rounded-md max-w-xs">
          <img src={message.emoji?.src.url} alt={message.emoji?.name} />
        </div>
      )
    case MessageTypeEnum.IMAGE:
      return (
        <div
          className={cn(
            'bg-accent p-3 rounded-md max-w-xs',
            isAuth && 'text-primary-foreground '
          )}
        >
          <img src={message.image?.url} alt={message.image?.url} />
        </div>
      )
    default:
      return ``
  }
}

export default MessageContent
