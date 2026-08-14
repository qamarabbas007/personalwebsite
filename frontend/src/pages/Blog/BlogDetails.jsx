import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { getBlogBySlug } from "../../services/blogApi";
import Loading from "../../components/Loading/Loading";
import { formatDate, getFileUrl } from "../../utils/helpers";

const BlogDetails = () => {
  const { id: slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBlogBySlug(slug).then(({ data }) => setPost(data)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading fullPage />;
  if (!post) return (
    <main className="page-wrapper container text-center">
      <p className="text-muted">Article not found.</p>
      <Link to="/blog" className="btn btn-outline mt-3">Back to Blog</Link>
    </main>
  );

  return (
    <main className="page-wrapper">
      <article className="container" style={{ maxWidth: 760 }}>
        <Link to="/blog" className="btn btn-outline btn-sm mb-3"><FiArrowLeft /> All Articles</Link>
        {post.coverImage && (
          <img src={getFileUrl(post.coverImage)} alt={post.title} style={{ width: "100%", borderRadius: 20, marginBottom: 24 }} />
        )}
        <span className="badge">{post.category}</span>
        <h1 className="mt-2">{post.title}</h1>
        <p className="text-muted mt-1">
          {post.author} · {formatDate(post.createdAt)} · {post.views} views
        </p>
        <div className="mt-4" style={{ whiteSpace: "pre-line", color: "var(--text-muted)" }}>
          {post.content}
        </div>
      </article>
    </main>
  );
};

export default BlogDetails;
