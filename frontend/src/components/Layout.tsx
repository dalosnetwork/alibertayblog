import { Form, Link, Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()

  return (
    <div className="site-shell">
      <div className="scanline" aria-hidden="true" />
      <header className="topbar">
        <Link to="/" className="brand">
          <span>ALI BERTAY</span>
          <strong>TERMINAL PRESS</strong>
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
          <input name="q" placeholder="Arşivde ara..." />
          <button type="submit">SCAN</button>
        </Form>
      </header>
      <div className="signal-bar">LIVE FEED // IDEAS • ENGINEERING • CULTURE // SIGNAL: STABLE</div>
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
