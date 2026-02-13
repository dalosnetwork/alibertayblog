import { useEffect, useMemo, useState } from 'react'
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
  const sidePosts = useMemo(() => posts.slice(1, 7), [posts])
  const gridPosts = useMemo(() => posts.slice(7), [posts])

  return (
    <div>
      {hero && (
        <section className="hero-grid">
          <article className="hero">
            <div className="kicker">MANŞET</div>
            <h1>{hero.title}</h1>
            <p>{hero.subtitle}</p>
            <PostCard post={hero} />
          </article>
          <aside className="side-list">
            {sidePosts.map((post) => (
              <PostCard key={post.id} post={post} compact />
            ))}
          </aside>
        </section>
      )}

      <section className="post-grid">
        {gridPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>

      {posts.length < total && (
        <button className="load-more" onClick={() => setPage((p) => p + 1)}>
          Daha Fazla
        </button>
      )}
    </div>
  )
}
