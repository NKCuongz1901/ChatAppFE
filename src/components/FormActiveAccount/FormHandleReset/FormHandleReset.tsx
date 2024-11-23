import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ACTIVE_ACCOUNT_KEY } from '@/pages/ResetPassPage/ResetPassPage'
import AuthServices from '@/services/authServices'
import { alertErrorAxios } from '@/utils/alert'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'

const formSchema = z
  .object({
    code: z.string(),
    password: z.string().min(6),
  })
  .required()

type FormHandleResetProp = {
  email: string
  setEmail: (value: string) => void
}

const FormHandleReset = ({ email, setEmail }: FormHandleResetProp) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: AuthServices.handleResetPassword,
  })

  const navigate = useNavigate()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const body = { ...values, email: email }
      console.log(body)
      const res = await mutation.mutateAsync(body)
      const data = res.data

      toast.success(data.message)
      localStorage.removeItem(ACTIVE_ACCOUNT_KEY)

      setTimeout(() => {
        console.log('redirect')

        navigate('/login')
      }, 1000)
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  const onRollback = () => {
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY)
    setEmail('')
  }

  const onCancel = () => {
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY)
    navigate('/login')
  }

  return (
    <Card className="w-[450px] max-w-full mx-auto">
      <CardHeader>
        <CardTitle className="border-b pb-5">Lấy lại mật khẩu</CardTitle>
        <CardDescription>
          vui lòng kiểm tra email để lấy mã bảo mật
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex gap-4 items-center">
                  <FormControl className="w-1/2">
                    <Input placeholder="nhập mã bảo mật" {...field} />
                  </FormControl>
                  <FormDescription className="w-1/2">
                    đã gửi mã bảo mật đến email {email}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="nhập mật khẩu mới" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="link"
              onClick={onRollback}
              className="px-0"
            >
              Không nhận được mã bảo mật?
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={onCancel}>
                Hủy
              </Button>
              <Button type="submit">Tiếp tục</Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default FormHandleReset
