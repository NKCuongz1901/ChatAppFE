import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AuthServices from '@/services/authServices'
import { alertErrorAxios } from '@/utils/alert'
import { ACTIVE_ACCOUNT_KEY } from '@/pages/ResetPassPage/ResetPassPage'

type FormRequestResetProp = {
  setEmail: (value: string) => void
}

const formSchema = z.object({
  email: z.string().email(),
})

const FormRequestReset = ({ setEmail }: FormRequestResetProp) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const mutation = useMutation({
    mutationFn: AuthServices.requestResetPassword,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await mutation.mutateAsync(values)
      const data = res.data

      toast.success(data.message)

      setEmail(values.email)
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, values.email)
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <Card className="w-[400px] max-w-full mx-auto">
      <CardHeader>
        <CardTitle className="border-b pb-5">Lấy lại mật khẩu</CardTitle>
        <CardDescription>
          Vui lòng nhập email để lấy lại mật khẩu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nhập email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Tiếp theo</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default FormRequestReset
