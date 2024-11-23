import { Card, CardContent } from '@/components/ui/card'
import { Outlet } from 'react-router-dom'

const AuthenticationLayout = () => {
  return (
    <main className="container flex justify-evenly h-screen items-center">
      <Card className="w-[400px] max-w-full">
        <CardContent className="p-4">
          <Outlet />
        </CardContent>
      </Card>
    </main>
  )
}

export default AuthenticationLayout
