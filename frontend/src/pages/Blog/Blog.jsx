import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogs } from "../../services/blogApi";
import Loading from "../../components/Loading/Loading";
import { formatDate, truncate, getFileUrl } from "../../utils/helpers";
import "./Blog.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      getBlogs({ published: true, limit: 100, search: search || undefined })
        .then(({ data }) => setBlogs(data))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Blog</span>
          <h1>Articles & Insights</h1>
          <p>Thoughts on MERN stack development, architecture and best practices.</p>
        </div>

        <input
          className="form-control"
          style={{ maxWidth: 420, margin: "0 auto 32px" }}
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? <Loading /> : (
          <div className="grid grid-3">
            {blogs.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post._id} className="glass-card blog-card">
                {post.coverImage && <img src={getFileUrl(post.coverImage)} alt={post.title} className="blog-cover" />}
                <div style={{ padding: 20 }}>
                  <span className="badge">{post.category}</span>
                  <h3 className="mt-2">{post.title}</h3>
                  <p className="text-muted mt-1">{truncate(post.excerpt || post.content, 100)}</p>
                  <span className="text-muted mt-2" style={{ fontSize: "0.8rem", display: "block" }}>
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
            {blogs.length === 0 && <p className="text-muted">No articles yet — check back soon.</p>}
          </div>
        )}
      </div>
    </main>
  );
};

export default Blog;
