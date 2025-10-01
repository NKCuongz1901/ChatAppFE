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
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const ProfilePage = () => {
  const [avatar, setAvatar] = useState<FileUploadResponse | null>()
  const [twoFAEnableOption, setTwoFAEnableOption] = useState<boolean>(false)
  const [twoFARecoveryCode, setTwoFARecoveryCode] = useState<string>('')
  const [qrCode, setQrCode] = useState<string>('')
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

  const onToggleTwoFa = async (checked: boolean) => {
    try {
      if (checked) {
        const res = await AuthServices.enableTwoFA()
        setQrCode(res.data.qrcode)
        setTwoFAEnableOption(true)
      } else {
        await AuthServices.disableTwoFA()
        setTwoFAEnableOption(false)
      }
    } catch (error) {
      toast.error('Lỗi khi bật/tắt 2FA')
    }
  }

  const onConfirm2FA = async (code: string) => {
    try {
      await AuthServices.verifyTwoFACode({ code })
      setTwoFAEnableOption(false)
      setQrCode('')
      toast.success('Bật 2FA thành công')
    } catch (e) {
      toast.error('Mã không hợp lệ')
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
            <h4 className="font-semibold text-xl text-blue-700">
              {auth.user.fullName}
            </h4>
            <h4 className="font-semibold text-xl text-blue-700">
              {auth.user.email}
            </h4>
            <div className="flex items-center gap-3 mt-5">
              <Label htmlFor="twofa-switch">Bật xác thực 2 bước (2FA)</Label>
              <Switch
                id="twofa-switch"
                aria-label="Bật xác thực 2 bước"
                defaultChecked={false}
                onCheckedChange={onToggleTwoFa}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={twoFAEnableOption} onOpenChange={setTwoFAEnableOption}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quét QR để bật 2FA</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3">
            {qrCode && <img src={qrCode} alt="QR 2FA" className="w-56 h-56" />}
            <Input
              placeholder="Nhập mã 6 số"
              value={twoFARecoveryCode}
              onChange={(e) => setTwoFARecoveryCode(e.target.value)}
              maxLength={6}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => onConfirm2FA(twoFARecoveryCode)}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfilePage
