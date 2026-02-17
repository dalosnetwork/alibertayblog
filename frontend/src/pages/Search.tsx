import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import PostCard from "../components/PostCard";
import { api, type Post } from "../lib/api";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const [items, setItems] = useState<Post[]>([]);

  useEffect(() => {
    if (!q) return;
    api.searchPosts(q).then((res) => setItems(res.items));
  }, [q]);

  return (
    <Seo
      title={q ? `Arama: ${q} | Ali Bertay Blog` : "Arama | Ali Bertay Blog"}
      description="Blog arşivinde içerik arayın."
      canonicalPath={q ? `/search?q=${encodeURIComponent(q)}` : "/search"}
      noindex={!q}
    >
      <section>
        <h2>Arama: {q}</h2>
        <div className="post-grid">
          {items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </Seo>
  );
}
