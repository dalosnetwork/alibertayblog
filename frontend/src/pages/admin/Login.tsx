import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const username = String(fd.get('username') ?? '')
    const password = String(fd.get('password') ?? '')

    try {
      const res = await api.adminLogin(username, password)
      localStorage.setItem('admin_token', res.access_token)
      navigate('/admin')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <section className="admin-panel">
      <h2>Admin Giriş</h2>
      <form onSubmit={onSubmit}>
        <input name="username" placeholder="Kullanıcı adı" required />
        <input name="password" type="password" placeholder="Şifre" required />
        <button type="submit">Giriş Yap</button>
      </form>
      {error && <p>{error}</p>}
    </section>
  )
}
