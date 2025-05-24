import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Create = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const post = { title, content };

    try {
      const res = await fetch("https://api-alibertay.dalosnetwork.com/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token, // 🔑 ISO uyumlu header
        },
        body: JSON.stringify(post),
      });

      if (res.ok) {
        alert("Post created!");
        setTitle("");
        setContent("");
      } else {
        alert("Unauthorized or error occurred.");
      }
    } catch (err) {
      alert("Network error");
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <form className="create-form" onSubmit={handleSubmit}>
        <input
          placeholder="Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default Create;
