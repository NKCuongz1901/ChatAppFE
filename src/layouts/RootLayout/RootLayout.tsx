import { Outlet } from 'react-router-dom'
import SideBar from './components/SideBar'

const RootLayout = () => {
  return (
    <div className="flex">
      <SideBar />
      <main className="w-full h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout
