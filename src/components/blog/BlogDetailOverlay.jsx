import { Link, useNavigate } from "react-router-dom";
import { CloseIcon } from "../icons/CommonIcons";
import BlogMeta from "./BlogMeta";

function BlogDetailOverlay({ post }) {
  const navigate = useNavigate();

  function closeOverlay() {
    navigate("/blog");
  }

  return (
    <div className="blog-detail-overlay" onClick={closeOverlay}>
      <article
        className="blog-detail-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <Link className="blog-detail-close" to="/blog" aria-label="Fechar artigo">
          <CloseIcon />
        </Link>

        {post ? (
          <>
            <div className="blog-detail-media">
              <span className="blog-detail-tag">{post.categoria}</span>
              <img src={post.imagem} alt={post.titulo} />
            </div>

            <div className="blog-detail-body">
              <BlogMeta post={post} />
              <h2>{post.titulo}</h2>
              <p className="blog-detail-intro">{post.excerto}</p>

              <div className="blog-detail-content">
                {post.conteudo.map((section) => (
                  <section className="blog-detail-section" key={section.titulo}>
                    <h3>{section.titulo}</h3>
                    {section.paragrafos.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </section>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="blog-detail-empty">
            <h2>Artigo nao encontrado</h2>
            <p>Este artigo nao esta disponivel de momento.</p>
            <Link className="blog-detail-back" to="/blog">
              Voltar ao Blog
            </Link>
          </div>
        )}
      </article>
    </div>
  );
}

export default BlogDetailOverlay;
