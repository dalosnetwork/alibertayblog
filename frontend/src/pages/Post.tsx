import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { api, type Post } from "../lib/api";

export default function PostPage() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getPost(slug)
      .then(setPost)
      .catch((e: Error) => setError(e.message));
  }, [slug]);

  if (error)
    return (
      <Seo title="Yazı bulunamadı | Ali Bertay Blog" noindex>
        <p>{error}</p>
      </Seo>
    );
  if (!post) return <p>Yükleniyor...</p>;

  return (
    <Seo
      title={`${post.title} | Ali Bertay Blog`}
      description={post.subtitle ?? undefined}
      canonicalPath={`/p/${post.slug}`}
      ogType="article"
    >
      <article className="detail">
        <h1>{post.title}</h1>
        <p>{post.subtitle}</p>
        <div className="meta">
          {new Date(post.published_at ?? post.created_at).toLocaleString(
            "tr-TR",
          )}{" "}
          • {post.tags}
        </div>
        <ReactMarkdown>{post.content_md}</ReactMarkdown>
        <Link to="/">← Ana sayfaya dön</Link>
      </article>
    </Seo>
  );
}
