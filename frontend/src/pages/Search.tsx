import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { api, type Post } from '../lib/api'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const [items, setItems] = useState<Post[]>([])

  useEffect(() => {
    if (!q) return
    api.searchPosts(q).then((res) => setItems(res.items))
  }, [q])

  return (
    <section>
      <h2>Arama: {q}</h2>
      <div className="post-grid">
        {items.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
