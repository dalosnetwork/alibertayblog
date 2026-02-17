import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { api, type Post } from "../lib/api";
import PostCard from "../components/PostCard";

function extractTopTags(posts: Post[]): string[] {
  const counts = new Map<string, number>();
  posts.forEach((post) => {
    post.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag]) => tag);
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.listPosts(page, 12).then((res) => {
      setTotal(res.total);
      setPosts((prev) => (page === 1 ? res.items : [...prev, ...res.items]));
    });
  }, [page]);

  const hero = posts[0];
  const sidePosts = useMemo(() => posts.slice(1, 6), [posts]);
  const gridPosts = useMemo(() => posts.slice(6), [posts]);
  const topTags = useMemo(() => extractTopTags(posts), [posts]);

  return (
    <Seo
      title="Ali Bertay Blog | Terminal Press"
      description="Yazılım, mühendislik ve kültür üzerine güncel yazılar."
      canonicalPath="/"
    >
      <div>
        <section className="edition-strip">
          <span>EDITION // {new Date().toLocaleDateString("tr-TR")}</span>
          <span>CHANNEL: OP-ED / ENGINEERING</span>
        </section>

        {!!topTags.length && (
          <section className="topic-rail">
            {topTags.map((tag) => (
              <span key={tag} className="topic-chip">
                {tag}
              </span>
            ))}
          </section>
        )}

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

        {!posts.length && (
          <div className="empty-state">Henüz yayınlanmış yazı bulunmuyor.</div>
        )}

        {posts.length < total && (
          <button className="load-more" onClick={() => setPage((p) => p + 1)}>
            Daha Fazla Yükle
          </button>
        )}
      </div>
    </Seo>
  );
}
