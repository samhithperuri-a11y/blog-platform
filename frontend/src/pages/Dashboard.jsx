import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // create
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // edit
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to load posts");
      // if unauthorized -> go login
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/posts", {
        title: newTitle,
        content: newContent,
      });

      setPosts((prev) => [res.data, ...prev]);
      setNewTitle("");
      setNewContent("");
    } catch (err) {
      alert(err?.response?.data?.error || "Create failed");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this post?");
    if (!ok) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err?.response?.data?.error || "Delete failed");
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setTitle(p.title || "");
    setContent(p.content || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/posts/${editingId}`, { title, content });
      setPosts((prev) => prev.map((p) => (p.id === editingId ? res.data : p)));
      cancelEdit();
    } catch (err) {
      alert(err?.response?.data?.error || "Update failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      {/* Top bar */}
      <div className="topbar">
        <h2 className="h2" style={{ margin: 0 }}>
          Dashboard
        </h2>
        <button className="btn btn-ghost" onClick={logout}>
          Logout
        </button>
      </div>

      {/* 2 column layout */}
      <div className="grid">
        {/* Left: Create Post */}
        <div className="card card-pad">
          <h3 style={{ marginTop: 0 }}>Create Post</h3>

          <form onSubmit={handleCreate}>
            <div className="field">
              <div className="label">Title</div>
              <input
                className="input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Post title"
              />
            </div>

            <div className="field">
              <div className="label">Content</div>
              <textarea
                className="textarea"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write something..."
              />
            </div>

            <button className="btn btn-primary" type="submit">
              Create
            </button>
          </form>
        </div>

        {/* Right: Posts List */}
        <div className="card card-pad">
          <h3 style={{ marginTop: 0 }}>Posts</h3>

          {loading ? (
            <p className="p">Loading...</p>
          ) : posts.length === 0 ? (
            <p className="p">No posts found</p>
          ) : (
            posts.map((p) => (
              <div key={p.id} className="post" style={{ marginBottom: 12 }}>
                <div className="post-title">{p.title}</div>
                <div className="p">{p.content}</div>
                <div className="post-meta">Created by: {p.created_by}</div>

                <div className="post-actions">
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => startEdit(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit section */}
      {editingId && (
        <div
          className="card card-pad"
          style={{ marginTop: 18, maxWidth: 900 }}
        >
          <h3 style={{ marginTop: 0 }}>Edit Post</h3>

          <form onSubmit={handleUpdate}>
            <div className="field">
              <div className="label">Title</div>
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="field">
              <div className="label">Content</div>
              <textarea
                className="textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              style={{ marginRight: 10 }}
            >
              Update
            </button>

            <button className="btn btn-ghost" type="button" onClick={cancelEdit}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Dashboard;



