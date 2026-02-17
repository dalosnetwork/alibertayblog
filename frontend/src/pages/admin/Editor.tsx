import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Seo from "../../components/Seo";
import { api, getToken, type Post } from "../../lib/api";

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  tags: "",
  content_md: "",
  is_published: false,
};

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (id) {
      api.adminPosts(token).then((posts) => {
        const found = posts.find((p) => p.id === Number(id));
        if (found) {
          setForm({
            title: found.title,
            subtitle: found.subtitle ?? "",
            tags: found.tags,
            content_md: found.content_md,
            is_published: found.is_published,
          });
        }
      });
    }
  }, [id]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = getToken();
    if (!token) return navigate("/admin/login");

    const payload: Partial<Post> = { ...form };
    if (id) await api.updatePost(token, Number(id), payload);
    else await api.createPost(token, payload);
    navigate("/admin");
  }

  return (
    <Seo title={`${id ? "Yazı Düzenle" : "Yeni Yazı"} | Admin`} noindex>
      <section className="admin-panel">
        <h2>{id ? "Yazı Düzenle" : "Yeni Yazı"}</h2>
        <form onSubmit={submit} className="editor-form">
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Başlık"
            required
          />
          <input
            value={form.subtitle}
            onChange={(e) =>
              setForm((f) => ({ ...f, subtitle: e.target.value }))
            }
            placeholder="Alt başlık"
          />
          <input
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            placeholder="etiket1,etiket2"
          />
          <textarea
            value={form.content_md}
            onChange={(e) =>
              setForm((f) => ({ ...f, content_md: e.target.value }))
            }
            placeholder="Markdown içerik"
            rows={12}
            required
          />
          <label>
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_published: e.target.checked }))
              }
            />{" "}
            Yayında
          </label>
          <button type="submit">Kaydet</button>
        </form>
      </section>
    </Seo>
  );
}
