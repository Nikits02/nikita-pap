import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../icons/CommonIcons";
import BlogMeta from "./BlogMeta";

function BlogPostCard({ post, featured = false }) {
  const LinkHeading = featured ? "h2" : "h3";

  if (featured) {
    return (
      <Link className="blog-feature-card" to={`/blog/${post.slug}`}>
        <div className="blog-feature-card__media">
          <span className="blog-feature-card__tag">{post.categoria}</span>
          <img src={post.imagem} alt={post.titulo} />
        </div>

        <div className="blog-feature-card__content">
          <BlogMeta post={post} />
          <LinkHeading>{post.titulo}</LinkHeading>
          <p>{post.excerto}</p>
          <div className="blog-feature-card__footer">
            <span>{post.autor}</span>
            <span className="blog-feature-card__cta">
              Ler Mais
              <ArrowRightIcon />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link className="blog-list-card" to={`/blog/${post.slug}`}>
      <div className="blog-list-card__media">
        <span className="blog-list-card__tag">{post.categoria}</span>
        <img src={post.imagem} alt={post.titulo} />
      </div>

      <div className="blog-list-card__body">
        <BlogMeta post={post} />
        <LinkHeading>{post.titulo}</LinkHeading>
        <p>{post.excerto}</p>
        <span className="blog-list-card__cta">
          Ler Mais
          <ArrowRightIcon />
        </span>
      </div>
    </Link>
  );
}

export default BlogPostCard;
