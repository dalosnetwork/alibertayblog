import { Link } from 'react-router-dom'
import type { Post } from '../lib/api'

interface Props {
  post: Post
  compact?: boolean
}

export default function PostCard({ post, compact = false }: Props) {
  const tags = post.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  return (
    <article className={`post-card ${compact ? 'compact' : ''}`}>
      <div className="meta">{new Date(post.published_at ?? post.created_at).toLocaleDateString('tr-TR')}</div>
      <h3>
        <Link to={`/p/${post.slug}`}>{post.title}</Link>
      </h3>
      {post.subtitle && <p>{post.subtitle}</p>}
      <div className="tag-row">
        {tags.map((tag) => (
          <span key={tag} className="tag-pill">
            #{tag}
          </span>
        ))}
      </div>
    </article>
  )
}
