import { createBrowserRouter, Navigate } from 'react-router-dom'
// import RootLayout from '@/layouts/RootLayout'
import NotFoundPage from '@/pages/NotFoundPage'
import { AuthEvent, AuthGuard } from '@/providers/AuthProvider'
import RootLayout from '@/layouts/RootLayout'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import AuthenticationLayout from '@/layouts/AuthenticationLayout'
import ResetPassPage from '@/pages/ResetPassPage'
import FriendPage from '@/pages/FriendPage'
import ChatLayout from '@/layouts/ChatLayout'
import ProfilePage from '@/pages/ProfilePage'
import EventProvider from '@/providers/EventProvider'

const router = createBrowserRouter([
  {
    path: '*',
    element: <NotFoundPage />,
  },
  {
    element: (
      <AuthGuard>
        <AuthEvent />
      </AuthGuard>
    ),
    children: [
      {
        element: (
          <EventProvider>
            <RootLayout />
          </EventProvider>
        ),
        children: [
          {
            element: <ChatLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/chats" />,
              },
              {
                path: 'chats/:chatId?',
                element: <HomePage />,
              },
              {
                path: 'friends/:chatId?',
                element: <FriendPage />,
              },
            ],
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthenticationLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: 'forgot-password',
    element: <ResetPassPage />,
  },
])

export default router
