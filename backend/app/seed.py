from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Post
from app.services.slug import generate_unique_slug


SAMPLE_POSTS = [
    {
        "title": "Dijital Ekonomide Yeni Denge Arayışı",
        "subtitle": "Uzun analiz: regülasyon, inovasyon ve rekabet dengesi",
        "content_md": "# Dijital Ekonomide Yeni Denge Arayışı\n\nPazarlar artık platformlar etrafında yeniden şekilleniyor...\n\n## Sonuç\nSürdürülebilirlik için şeffaf veri politikası şart.",
        "tags": "ekonomi,teknoloji,analiz",
        "is_published": True,
    },
    {
        "title": "Yapay Zeka Çağında Üretkenlik ve Etik",
        "subtitle": "Uzun dosya: ekipler için pratik bir yol haritası",
        "content_md": "# Yapay Zeka Çağında Üretkenlik ve Etik\n\nKurumsal ekiplerde AI kullanımı hızla artıyor...\n\n## Tavsiye\nPolitika + eğitim + ölçüm üçlüsü birlikte yürütülmeli.",
        "tags": "yapay-zeka,etik,iş",
        "is_published": True,
    },
    {
        "title": "Haftanın Notları: API Tasarımında 5 Ders",
        "subtitle": "Orta uzunlukta teknik özet",
        "content_md": "REST ve event-driven yaklaşımlar birlikte kullanıldığında...",
        "tags": "backend,api",
        "is_published": True,
    },
    {
        "title": "Uzaktan Çalışmada Asenkron İletişim",
        "subtitle": "Orta boy pratik öneriler",
        "content_md": "Asenkron kültür, toplantı yükünü azaltırken karar kalitesini artırabilir.",
        "tags": "kültür,uzaktan",
        "is_published": False,
    },
    {
        "title": "Frontend Performansında İlk 15 Dakika",
        "subtitle": "Orta: ölçüm ve hızlı kazanımlar",
        "content_md": "İlk adım her zaman ölçmek: web vitals, bundle analizi ve kritik CSS.",
        "tags": "frontend,performans",
        "is_published": True,
    },
    {
        "title": "Kısa Görüş: Not Almanın Gücü",
        "subtitle": "Kısa",
        "content_md": "İyi not, iyi düşüncenin yarısıdır.",
        "tags": "verimlilik",
        "is_published": True,
    },
    {
        "title": "Kısa Görüş: Sessiz Saatler",
        "subtitle": "Kısa",
        "content_md": "Günün en sessiz saatlerinde zor işleri tamamlamak daha kolay.",
        "tags": "odak",
        "is_published": False,
    },
    {
        "title": "Kısa Görüş: Kod İncelemede Nezaket",
        "subtitle": "Kısa",
        "content_md": "Kod review, kişiyi değil değişikliği değerlendirir.",
        "tags": "mühendislik,ekip",
        "is_published": True,
    },
]


def seed_posts(db: Session) -> None:
    exists = db.execute(select(Post.id).limit(1)).scalar_one_or_none()
    if exists:
        return

    now = datetime.utcnow()
    for idx, data in enumerate(SAMPLE_POSTS):
        published = data["is_published"]
        post = Post(
            slug=generate_unique_slug(db, data["title"]),
            title=data["title"],
            subtitle=data["subtitle"],
            content_md=data["content_md"],
            tags=data["tags"],
            is_published=published,
            created_at=now - timedelta(days=idx),
            published_at=(now - timedelta(days=idx)) if published else None,
        )
        db.add(post)

    db.commit()
