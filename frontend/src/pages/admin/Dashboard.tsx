import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, getToken, type Post } from '../../lib/api'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])

  async function load() {
    const token = getToken()
    if (!token) return navigate('/admin/login')
    const data = await api.adminPosts(token)
    setPosts(data)
  }

  useEffect(() => {
    load().catch(() => navigate('/admin/login'))
  }, [])

  async function toggle(post: Post) {
    const token = getToken()
    if (!token) return
    if (post.is_published) await api.unpublishPost(token, post.id)
    else await api.publishPost(token, post.id)
    await load()
  }

  async function remove(id: number) {
    const token = getToken()
    if (!token) return
    await api.deletePost(token, id)
    await load()
  }

  return (
    <section className="admin-panel">
      <div className="admin-header">
        <h2>Dashboard</h2>
        <Link to="/admin/new">Yeni Yazı</Link>
      </div>
      {posts.map((post) => (
        <div key={post.id} className="admin-row">
          <div>
            <strong>{post.title}</strong>
            <span className={post.is_published ? 'badge published' : 'badge draft'}>{post.is_published ? 'YAYINDA' : 'TASLAK'}</span>
          </div>
          <div className="actions">
            <Link to={`/admin/edit/${post.id}`}>Düzenle</Link>
            <button onClick={() => toggle(post)}>{post.is_published ? 'Yayından Al' : 'Yayınla'}</button>
            <button onClick={() => remove(post.id)}>Sil</button>
          </div>
        </div>
      ))}
    </section>
  )
}
