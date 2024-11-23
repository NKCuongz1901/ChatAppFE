import ChatContainer from '@/components/ChatContainer'
import { Outlet } from 'react-router-dom'

const ChatLayout = () => {
  return (
    <div className="h-full items-stretch w-full text-sm border flex">
      <div className="relative group flex flex-col h-full gap-4 p-2 w-3/12 border-r">
        <Outlet />
      </div>
      <ChatContainer />
    </div>
  )
}

export default ChatLayout
