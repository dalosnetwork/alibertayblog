import { Form, Link, Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()

  return (
    <div className="site-shell">
      <div className="scanline" aria-hidden="true" />
      <header className="topbar">
        <Link to="/" className="brand">
          ALI BERTAY // TERMINAL PRESS
        </Link>
        <Form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const q = String(formData.get('q') ?? '').trim()
            if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
          }}
        >
          <input name="q" placeholder="Yazılarda ara..." />
          <button type="submit">Ara</button>
        </Form>
        <Link to="/admin" className="admin-link">
          Admin
        </Link>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
