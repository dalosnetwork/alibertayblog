import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 4;

  useEffect(() => {
    fetch("httpa://api-alibertay.dalosnetwork.com/posts/")
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Veri alınamadı:", err));
  }, []);

  const totalPages = Math.ceil(posts.length / perPage);
  const paginated = posts.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <Navbar />
      <div className="post-list">
        {paginated.map(post => (
          <Link key={post.id} to={`/post/${post.id}`} className="post-title">
            {post.title}
          </Link>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} className={page === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
