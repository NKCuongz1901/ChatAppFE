import { SingleImageUpload } from '@/components/FileUploads'
import PathUploadFile from '@/constants/uploads/uploadPath'
import { FileUploadResponse } from '@/types/fileUploadType'
import { Image } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/app/hooks'
import { selectAuth } from '@/features/auth/authSlice'
import { updateAvatarAuth } from '@/utils/utils'
import { alertErrorAxios } from '@/utils/alert'
import AuthServices from '@/services/authServices'
import { toast } from 'react-toastify'

const ProfilePage = () => {
  const [avatar, setAvatar] = useState<FileUploadResponse | null>()
  const auth = useAppSelector(selectAuth)
  const handleUpdateAvatarLocal = updateAvatarAuth()

  const handleUpdateAvatar = async () => {
    try {
      await AuthServices.updateAvatar({
        avatar: avatar!,
      })
      toast.success('Đổi ảnh đại diện thành công')
      handleUpdateAvatarLocal(avatar)
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <Card className="min-w-[400px]">
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div>
            <div className="w-32 h-32 mb-4">
              <SingleImageUpload
                pathUpload={PathUploadFile.AUTH}
                onUpload={(data) => {
                  setAvatar(data)
                }}
                onDelete={() => {
                  setAvatar(null)
                  handleUpdateAvatarLocal(null)
                }}
                fileUpload={auth.user.avatar}
              >
                <Image size={100} />
              </SingleImageUpload>
            </div>
            <Button disabled={!avatar?.url} onClick={handleUpdateAvatar}>
              Đổi ảnh đại diện
            </Button>
          </div>
          <div>
            <h4 className="font-semibold text-xl text-blue-700">{auth.user.fullName}</h4>
            <h4 className="font-semibold text-xl text-blue-700">{auth.user.email}</h4>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
