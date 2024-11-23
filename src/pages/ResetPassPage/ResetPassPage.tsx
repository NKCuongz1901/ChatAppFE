import FormHandleReset from '@/components/FormActiveAccount/FormHandleReset'
import FormRequestReset from '@/components/FormActiveAccount/FormRequestReset'
import { useState } from 'react'

export const ACTIVE_ACCOUNT_KEY = 'ACTIVE_ACCOUNT_KEY_EMAIL'

const ResetPassPage = () => {
  // 1. Define your form.
  const [email, setEmail] = useState(
    localStorage.getItem(ACTIVE_ACCOUNT_KEY) ?? ''
  )

  return (
    <div className="flex items-center h-screen">
      {!email && <FormRequestReset setEmail={setEmail} />}
      {email && <FormHandleReset email={email} setEmail={setEmail} />}
    </div>
  )
}

export default ResetPassPage
