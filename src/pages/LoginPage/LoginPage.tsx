import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import AuthService from '@/services/authServices'
import { useAppDispatch } from '@/app/hooks'
import { updateAuth } from '@/features/auth/authSlice'
import { setAuthLS } from '@/utils/authLS'
import { AuthResponse } from '@/types/authType'
import { alertErrorAxios } from '@/utils/alert'
import { useState } from 'react'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  code: z.string().optional(),
})

const LoginPage = () => {
  const dispatch = useAppDispatch()
  const [show2FA, setShow2FA] = useState(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      code: undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: AuthService.login,
  })

  const navigate = useNavigate()

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await mutation.mutateAsync(values)
      const data: AuthResponse = res.data

      dispatch(
        updateAuth({
          isAuthenticated: true,
          user: data.user,
        })
      )

      setAuthLS(data)
      toast.success('đăng nhập thành công')

      setTimeout(() => {
        console.log('redirect')

        navigate('/')
      }, 1000)
    } catch (error: any) {
      if (error.response.data.message === 'Vui lòng nhập mã 2FA') {
        setShow2FA(true)
      }
      toast.error(error.response.data.message)
      return
    }
  }

  const onRedirectToCreateAccount = () => {
    navigate('/register')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
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
                <Input placeholder="password" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {show2FA && (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="mã 2FA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full">
          Đăng nhập
        </Button>
        <div className="w-full flex justify-evenly mb-4 border-b">
          <Button type="button" variant="link">
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </Button>
        </div>
        <div className="w-full flex justify-center">
          <Button
            type="button"
            variant="default"
            onClick={onRedirectToCreateAccount}
          >
            Đăng ký
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginPage
