import { useParams } from 'react-router-dom'
import ChatBox from '../ChatBox'
import { cn } from '@/utils/utils'

const ChatContainer = () => {
  const { chatId } = useParams()

  return (
    <div
      className={cn(
        `flex flex-col justify-between w-full h-full`,
        !chatId && 'items-center justify-center'
      )}
    >
      {chatId && <ChatBox />}
      {!chatId && (
        <h2 className="text-2xl font-semibold uppercase">
          Không có đoạn chat nào được chọn
        </h2>
      )}
    </div>
  )
}

export default ChatContainer
