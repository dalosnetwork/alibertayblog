import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type Props = {
  title: string
  description?: string
  noindex?: boolean
  canonicalPath?: string // örn: "/p/slug"
  ogType?: 'website' | 'article'
  ogImage?: string
  children: React.ReactNode
}

function upsertMetaByName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertMetaByProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo({
  title,
  description,
  noindex,
  canonicalPath,
  ogType = 'website',
  ogImage,
  children,
}: Props) {
  const location = useLocation()

  useEffect(() => {
    const desc = description?.trim() || ''
    const path = canonicalPath ?? location.pathname
    const origin = window.location.origin.replace(/\/+$/, '')
    const canonical = `${origin}${path.startsWith('/') ? '' : '/'}${path}`

    document.title = title

    if (desc) {
      upsertMetaByName('description', desc)
      upsertMetaByProperty('og:description', desc)
    }

    // canonical + og:url
    upsertLink('canonical', canonical)
    upsertMetaByProperty('og:url', canonical)

    // OG basics
    upsertMetaByProperty('og:title', title)
    upsertMetaByProperty('og:type', ogType)
    upsertMetaByProperty('og:site_name', 'Ali Bertay Blog')

    // Twitter (basit)
    upsertMetaByName('twitter:card', ogImage ? 'summary_large_image' : 'summary')

    if (ogImage) {
      upsertMetaByProperty('og:image', ogImage)
      upsertMetaByName('twitter:image', ogImage)
    }

    // robots
    if (noindex) {
      upsertMetaByName('robots', 'noindex, nofollow, noarchive, nosnippet, noimageindex')
    } else {
      upsertMetaByName('robots', 'index, follow')
    }
  }, [title, description, noindex, canonicalPath, ogType, ogImage, location.pathname])

  return <>{children}</>
}
