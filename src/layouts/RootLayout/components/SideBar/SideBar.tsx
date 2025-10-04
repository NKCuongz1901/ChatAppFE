import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Command, CommandItem, CommandList } from '@/components/ui/command'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { ROOT_ROUTES_NAVIGATE } from '@/constants/routes/RoutesNavigate'
import { resetAuth, selectAuth } from '@/features/auth/authSlice'
import { checkActiveRoute } from '@/utils/utils'
import { CircleUserRound } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/app/hooks'
import { resetAuthLS } from '@/utils/authLS'

const SideBar = () => {
  const auth = useSelector(selectAuth)

  const { chatId } = useParams()
  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const handleLogout = () => {
    dispatch(resetAuth())
    resetAuthLS()
    navigate('/login')
  }

  return (
    <aside className="pt-10 p-2">
      <Command>
        <CommandList className="max-h-full h-full flex flex-col justify-between">
          {ROOT_ROUTES_NAVIGATE.map((routeNavigate) => {
            const isActive = checkActiveRoute(routeNavigate.link)
            return (
              <TooltipProvider key={routeNavigate.link}>
                <Tooltip>
                  <CommandItem ignoreAriaSelectedStyles asChild>
                    <TooltipTrigger asChild>
                      <Link
                        to={`${routeNavigate.link}${
                          chatId ? `/${chatId}` : ''
                        }`}
                        className={`w-11 h-11 cursor-pointer flex items-center
                          justify-center hover:bg-secondary/80
                          ${isActive ? 'bg-secondary' : ''}
                        `}
                      >
                        {routeNavigate.icon}
                      </Link>
                    </TooltipTrigger>
                  </CommandItem>
                  <TooltipContent side="right">
                    {routeNavigate.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </CommandList>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size={'icon'}
              variant={'outline'}
              className="outline-none p-2"
            >
              {auth.user.avatar?.url ? (
                <Avatar className="flex justify-center items-center rounded-sm w-11 h-11">
                  <AvatarImage
                    src={auth.user.avatar.url}
                    alt={`avatar for ${auth.user.fullName}`}
                    className="w-10 h-10"
                  />
                  <AvatarFallback className="rounded-sm">
                    <CircleUserRound />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <CircleUserRound />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link to={'/profile'}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={'/login-sessions'}>Lịch sử đăng nhập</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Command>
    </aside>
  )
}

export default SideBar
