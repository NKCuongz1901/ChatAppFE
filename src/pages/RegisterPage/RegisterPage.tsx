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
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import UserGenderEnum from '@/constants/users/UserGenderEnum'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AuthServices from '@/services/authServices'
import Datepicker from 'react-tailwindcss-datepicker'
import { AuthResponse } from '@/types/authType'
import { useAppDispatch } from '@/app/hooks'
import { updateAuth } from '@/features/auth/authSlice'
import { setAuthLS } from '@/utils/authLS'
import { alertErrorAxios } from '@/utils/alert'

const formSchema = z
  .object({
    fullName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
    rePassword: z.string().min(1),
    gender: z.number(),
    birthdate: z.date(),
  })
  .required()

const RegisterPage = () => {
  const dispatch = useAppDispatch()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      rePassword: '',
      gender: UserGenderEnum.SECRET,
    },
  })

  const mutation = useMutation({
    mutationFn: AuthServices.register,
  })

  const navigate = useNavigate()

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { rePassword, ...body } = values

      if (body.password !== rePassword) {
        toast.error('Mật khẩu nhập lại không khớp')
        return
      }

      const res = await mutation.mutateAsync(body)
      const data: AuthResponse = res.data

      dispatch(
        updateAuth({
          isAuthenticated: true,
          user: data.user,
        })
      )

      setAuthLS(data)
      toast.success('đăng ký thành công')

      setTimeout(() => {
        console.log('redirect')

        navigate('/')
      }, 1000)
    } catch (error) {
      alertErrorAxios(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={'họ và tên'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder={'email'} {...field} />
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
                <Input placeholder={'mật khẩu'} {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rePassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={'nhập lại mật khẩu'}
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'giới tính'}</FormLabel>
              <Select
                onValueChange={(val) => {
                  form.setValue('gender', +val)
                }}
                value={`${field.value}`}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(UserGenderEnum.allName()).map((key) => {
                    return (
                      <SelectItem key={key} value={key}>
                        {UserGenderEnum.allName()[Number(key)]}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngày sinh</FormLabel>
              <div></div>
              <Datepicker
                useRange={false}
                asSingle={true}
                value={{ startDate: field.value, endDate: field.value }}
                onChange={(val) => {
                  console.log(val)
                  if (val?.startDate) {
                    form.setValue('birthdate', new Date(val.startDate))
                  }
                }}
                displayFormat={'DD/MM/YYYY'}
                minDate={new Date('1900-01-01')}
                maxDate={new Date()}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center flex-col">
          <Button type="submit" variant="default" className="px-10 ">
            Đăng ký
          </Button>
          <Button type="button" variant="link" className="w-fit p-0 ">
            <Link to="/login">Đã có tài khoản</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default RegisterPage
