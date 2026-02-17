export interface Post {
  id: number;
  slug: string;
  title: string;
  subtitle?: string | null;
  content_md: string;
  is_published: boolean;
  tags: string;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
}

const envBaseUrl = (
  import.meta.env.VITE_API_BASE_URL as string | undefined
)?.trim();

const BASE_URL =
  (envBaseUrl && envBaseUrl.replace(/\/+$/, "")) ||
  "https://api-alibertay.dalosnetwork.com";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${BASE_URL}${normalizedPath}`, options);
  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: "Bilinmeyen hata" }));
    throw new Error(data.detail ?? "İstek başarısız");
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export const api = {
  listPosts: (page = 1, pageSize = 12) =>
    request<{ page: number; page_size: number; total: number; items: Post[] }>(
      `/api/posts?page=${page}&page_size=${pageSize}`,
    ),
  getPost: (slug: string) => request<Post>(`/api/posts/${slug}`),
  searchPosts: (q: string) =>
    request<{ query: string; total: number; items: Post[] }>(
      `/api/search?q=${encodeURIComponent(q)}`,
    ),
  adminLogin: (username: string, password: string) =>
    request<{ access_token: string; token_type: string }>(`/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }),
  adminPosts: (token: string) =>
    request<Post[]>("/api/admin/posts", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  createPost: (token: string, payload: Partial<Post>) =>
    request<Post>("/api/admin/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }),
  updatePost: (token: string, id: number, payload: Partial<Post>) =>
    request<Post>(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }),
  deletePost: (token: string, id: number) =>
    request<void>(`/api/admin/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
  publishPost: (token: string, id: number) =>
    request<Post>(`/api/admin/posts/${id}/publish`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
  unpublishPost: (token: string, id: number) =>
    request<Post>(`/api/admin/posts/${id}/unpublish`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export function getToken(): string | null {
  return localStorage.getItem("admin_token");
}

export function requireToken(): string {
  const token = getToken();
  if (!token) {
    throw new Error("Lütfen giriş yapın");
  }
  return token;
}
