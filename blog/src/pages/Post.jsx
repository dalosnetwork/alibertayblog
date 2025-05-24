import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const parseContent = (text) => {
  const parts = text.split("<newp>").map((p, idx) => {
    const withLinks = p.split(/<link>(.*?)<\/link>/g).map((chunk, i) =>
      i % 2 === 1 ? (
        <a href={chunk} target="_blank" rel="noopener noreferrer" key={i}>{chunk}</a>
      ) : (
        chunk
      )
    );
    return <p key={idx}>{withLinks}</p>;
  });
  return parts;
};

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`https://api-alibertay.dalosnetwork.com/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(err => console.error("Post alınamadı:", err));
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="post-container">
        <h1>{post.title}</h1>
        <div className="post-content">{parseContent(post.content)}</div>
      </div>
    </div>
  );
};

export default Post;
