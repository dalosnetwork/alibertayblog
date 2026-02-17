import React from 'react'
import { createBrowserRouter, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import PostPage from '../pages/Post'
import SearchPage from '../pages/Search'
import LoginPage from '../pages/admin/Login'
import DashboardPage from '../pages/admin/Dashboard'
import EditorPage from '../pages/admin/Editor'
import Seo from '../components/Seo'

function PostRoute() {
  const { slug } = useParams()
  const safeSlug = slug ? decodeURIComponent(slug) : ''
  return (
    <Seo
      title={safeSlug ? `Yazı: ${safeSlug} | Ali Bertay Blog` : 'Yazı | Ali Bertay Blog'}
      description="Yazı detayı."
      canonicalPath={safeSlug ? `/p/${slug}` : '/'}
      ogType="article"
    >
      <PostPage />
    </Seo>
  )
}

function SearchRoute() {
  // Arama sayfaları genelde thin-content olduğu için noindex iyi pratik
  return (
    <Seo title="Arama | Ali Bertay Blog" description="Yazılarda arama." canonicalPath="/search" noindex>
      <SearchPage />
    </Seo>
  )
}

function AdminLoginRoute() {
  return (
    <Seo title="Admin Giriş | Ali Bertay Blog" canonicalPath="/admin/login" noindex>
      <LoginPage />
    </Seo>
  )
}

function AdminDashboardRoute() {
  return (
    <Seo title="Admin | Ali Bertay Blog" canonicalPath="/admin" noindex>
      <DashboardPage />
    </Seo>
  )
}

function AdminNewRoute() {
  return (
    <Seo title="Yeni Yazı | Ali Bertay Blog" canonicalPath="/admin/new" noindex>
      <EditorPage />
    </Seo>
  )
}

function AdminEditRoute() {
  const { id } = useParams()
  return (
    <Seo
      title={`Yazı Düzenle${id ? ` #${id}` : ''} | Ali Bertay Blog`}
      canonicalPath={id ? `/admin/edit/${id}` : '/admin'}
      noindex
    >
      <EditorPage />
    </Seo>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Seo title="Ali Bertay Blog" description="Yazılar, notlar ve projeler." canonicalPath="/">
            <Home />
          </Seo>
        ),
      },
      { path: 'p/:slug', element: <PostRoute /> },
      { path: 'search', element: <SearchRoute /> },

      { path: 'admin/login', element: <AdminLoginRoute /> },
      { path: 'admin', element: <AdminDashboardRoute /> },
      { path: 'admin/new', element: <AdminNewRoute /> },
      { path: 'admin/edit/:id', element: <AdminEditRoute /> },
    ],
  },
])
