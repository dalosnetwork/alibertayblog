import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import PostPage from '../pages/Post'
import SearchPage from '../pages/Search'
import LoginPage from '../pages/admin/Login'
import DashboardPage from '../pages/admin/Dashboard'
import EditorPage from '../pages/admin/Editor'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'p/:slug', element: <PostPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'admin/login', element: <LoginPage /> },
      { path: 'admin', element: <DashboardPage /> },
      { path: 'admin/new', element: <EditorPage /> },
      { path: 'admin/edit/:id', element: <EditorPage /> },
    ],
  },
])
