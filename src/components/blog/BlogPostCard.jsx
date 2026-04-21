import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../icons/CommonIcons";
import BlogMeta from "./BlogMeta";

function BlogPostCard({ post, featured = false }) {
  const Heading = featured ? "h2" : "h3";
  const cardClass = featured ? "blog-feature-card" : "blog-list-card";
  const contentClass = featured
    ? "blog-feature-card__content"
    : "blog-list-card__body";
  const ctaClass = `${cardClass}__cta`;

  const cta = (
    <span className={ctaClass}>
      Ler Mais
      <ArrowRightIcon />
    </span>
  );

  return (
    <Link className={cardClass} to={`/blog/${post.slug}`}>
      <div className={`${cardClass}__media`}>
        <span className={`${cardClass}__tag`}>{post.categoria}</span>
        <img src={post.imagem} alt={post.titulo} />
      </div>

      <div className={contentClass}>
        <BlogMeta post={post} />
        <Heading>{post.titulo}</Heading>
        <p>{post.excerto}</p>
        {featured ? (
          <div className="blog-feature-card__footer">
            <span>{post.autor}</span>
            {cta}
          </div>
        ) : (
          cta
        )}
      </div>
    </Link>
  );
}

export default BlogPostCard;
