import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Post } from '../lib/api'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    api.listPosts(page, 12).then((res) => {
      setTotal(res.total)
      setPosts((prev) => (page === 1 ? res.items : [...prev, ...res.items]))
    })
  }, [page])

  const hero = posts[0]
  const sidePosts = useMemo(() => posts.slice(1, 6), [posts])
  const gridPosts = useMemo(() => posts.slice(6), [posts])

  return (
    <div>
      {hero && (
        <section className="hero-grid">
          <article className="hero">
            <div className="kicker">MANŞET / FEATURED</div>
            <h1>{hero.title}</h1>
            <p>{hero.subtitle}</p>
            <div className="hero-actions">
              <Link className="hero-link" to={`/p/${hero.slug}`}>
                Devamını Oku →
              </Link>
            </div>
            <PostCard post={hero} />
          </article>
          <aside className="side-list">
            <h2 className="side-heading">Son Gelişmeler</h2>
            {sidePosts.map((post) => (
              <PostCard key={post.id} post={post} compact />
            ))}
          </aside>
        </section>
      )}

      <section className="section-header">
        <h2>Arşiv Akışı</h2>
        <span>
          {posts.length} / {total} kayıt
        </span>
      </section>

      <section className="post-grid">
        {gridPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>

      {!posts.length && <div className="empty-state">Henüz yayınlanmış yazı bulunmuyor.</div>}

      {posts.length < total && (
        <button className="load-more" onClick={() => setPage((p) => p + 1)}>
          Daha Fazla Yükle
        </button>
      )}
    </div>
  )
}
