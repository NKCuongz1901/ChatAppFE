import { useAppSelector } from '@/app/hooks'
import { selectAuth } from '@/features/auth/authSlice'
import { socket } from '@/utils/socket'
import { FC, ReactNode, useEffect } from 'react'

type SocketProviderProp = {
  children: ReactNode
}

const SocketProvider: FC<SocketProviderProp> = ({ children }) => {
  const auth = useAppSelector(selectAuth)

  const handleConnect = () => {
    console.log('---------socket---------')
    console.log('connected')
    console.log('---------/socket/---------')
  }

  const handleDisConnect = () => {
    console.log('---------socket---------')
    console.log('disconnected')
    console.log('---------/socket/---------')
  }

  useEffect(() => {
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisConnect)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisConnect)
    }
  }, [])

  useEffect(() => {
    if (auth.isInitialized && auth.isAuthenticated) {
      socket.emit('join', auth.user._id)
    }
  }, [auth])

  return children
}

export default SocketProvider
