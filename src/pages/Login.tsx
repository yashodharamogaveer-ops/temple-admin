import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button, Input, Label, Card } from '@/components/ui/primitives'
import toast from 'react-hot-toast'
import { Landmark } from 'lucide-react'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      toast.error(error)
      return
    }
    navigate('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-maroon-50 to-white px-4 dark:from-neutral-950 dark:to-neutral-900">
      <Card className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-maroon-600 text-white">
            <Landmark className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Temple Admin Panel</h1>
          <p className="text-sm text-neutral-500">ದೇವಸ್ಥಾನ ನಿರ್ವಹಣಾ ಫಲಕ</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@temple.org" />
          </div>
          <div className="mb-6">
            <Label>Password</Label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  )
}
