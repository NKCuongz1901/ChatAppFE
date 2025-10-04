import { useQuery } from '@tanstack/react-query'
import AuthServices from '@/services/authServices'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// Type cho LoginSession
type LoginSession = {
  _id: string
  userId: string
  browser: string
  browserVersion: string
  operatingSystem: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  ipAddress: string
  loginTime: string
  isActive: boolean
  userAgent: string
  createdAt: string
  updatedAt: string
}

const LOGIN_SESSIONS_QUERY_KEY = ['login-sessions']

function LoginSessionPage() {
  // Fetch data với TanStack Query
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: LOGIN_SESSIONS_QUERY_KEY,
    queryFn: () => AuthServices.getLoginHistory(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Lấy data từ response.data
  const loginSessions = response?.data || []

  console.log('check login sessions', loginSessions)

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('vi-VN'),
      time: date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
  }

  // Device icons
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return '📱'
      case 'tablet':
        return '📟'
      default:
        return '💻'
    }
  }

  // Browser icons
  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case 'chrome':
        return '🟢'
      case 'firefox':
        return '🦊'
      case 'safari':
        return '🧭'
      case 'edge':
        return '🔵'
      default:
        return '🌐'
    }
  }

  if (isLoading) {
    return <LoginSessionSkeleton />
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Lịch sử đăng nhập</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-red-500 py-8">
              <p>Không thể tải dữ liệu</p>
              <p className="text-sm text-gray-500 mt-2 mb-4">
                {error?.message || 'Đã xảy ra lỗi không xác định'}
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Phiên đăng nhập</h1>
        <p className="text-gray-600">
          Lịch sử đăng nhập của bạn ({loginSessions.length} phiên)
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lịch sử đăng nhập</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              {isLoading ? 'Đang tải...' : 'Làm mới'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trình duyệt</TableHead>
                  <TableHead>Phiên bản</TableHead>
                  <TableHead>Hệ điều hành</TableHead>
                  <TableHead>Thiết bị</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Địa chỉ IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginSessions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      Không có dữ liệu đăng nhập
                    </TableCell>
                  </TableRow>
                ) : (
                  loginSessions.map((session: LoginSession) => {
                    const { date, time } = formatDate(session.loginTime)
                    return (
                      <TableRow key={session._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {getBrowserIcon(session.browser)}
                            </span>
                            <span>{session.browser}</span>
                          </div>
                        </TableCell>
                        <TableCell>{session.browserVersion}</TableCell>
                        <TableCell>{session.operatingSystem}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {getDeviceIcon(session.deviceType)}
                            </span>
                            <span className="capitalize">
                              {session.deviceType}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{date}</div>
                            <div className="text-sm text-gray-500">{time}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {session.ipAddress}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Loading skeleton component
const LoginSessionSkeleton = () => (
  <div className="container mx-auto py-8 px-4">
    <div className="mb-6">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-64" />
    </div>
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trình duyệt</TableHead>
                <TableHead>Phiên bản</TableHead>
                <TableHead>Hệ điều hành</TableHead>
                <TableHead>Thiết bị</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Địa chỉ IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
)

export default LoginSessionPage
