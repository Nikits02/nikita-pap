import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { blogPosts } from "../data/blogPosts";

const categoryTabs = ["Todos", "Reviews", "Noticias", "Dicas"];

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8.5v4l2.5 1.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4.5v3M17 4.5v3" />
      <rect x="4.5" y="6.5" width="15" height="13" rx="1.5" />
      <path d="M4.5 10h15" />
    </svg>
  );
}

function AuthorIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3" />
      <path d="M6.5 18.5c1.4-2.7 3.4-4 5.5-4s4.1 1.3 5.5 4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7 17 17" />
      <path d="M17 7 7 17" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function BlogMeta({ post }) {
  return (
    <div className="blog-meta">
      <span>
        <ClockIcon />
        {post.leitura}
      </span>
      <span>
        <CalendarIcon />
        {post.data}
      </span>
      <span>
        <AuthorIcon />
        {post.autor}
      </span>
    </div>
  );
}

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

function Blog() {
  const { slug } = useParams();
  const [activeCategory, setActiveCategory] = useState("Todos");

  const selectedPost = slug
    ? blogPosts.find((post) => post.slug === slug)
    : null;

  const visiblePosts = useMemo(() => {
    if (activeCategory === "Todos") {
      return blogPosts;
    }

    return blogPosts.filter((post) => post.categoria === activeCategory);
  }, [activeCategory]);

  const [featuredPost, ...otherPosts] = visiblePosts;

  useEffect(() => {
    if (!slug) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [slug]);

  return (
    <>
      <Navbar />

      <main className={`page-shell blog-page${slug ? " blog-page--modal-open" : ""}`}>
        <section className="blog-page__hero">
          <p className="blog-page__eyebrow">NIKITAMOTORS</p>
          <h1>Blog</h1>
          <p>Novidades, dicas e tendencias do mundo automovel</p>
        </section>

        <div className="blog-page__divider" />

        <section className="blog-tabs" aria-label="Filtros do blog">
          {categoryTabs.map((category) => (
            <button
              key={category}
              className={`blog-tab${activeCategory === category ? " is-active" : ""}`}
              type="button"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </section>

        <div className="blog-page__divider" />

        {featuredPost && (
          <section className="blog-feature">
            <Link className="blog-feature-card" to={`/blog/${featuredPost.slug}`}>
              <div className="blog-feature-card__media">
                <span className="blog-feature-card__tag">{featuredPost.categoria}</span>
                <img src={featuredPost.imagem} alt={featuredPost.titulo} />
              </div>

              <div className="blog-feature-card__content">
                <BlogMeta post={featuredPost} />
                <h2>{featuredPost.titulo}</h2>
                <p>{featuredPost.excerto}</p>
                <div className="blog-feature-card__footer">
                  <span>{featuredPost.autor}</span>
                  <span className="blog-feature-card__cta">
                    Ler Mais
                    <ArrowIcon />
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {otherPosts.length > 0 && (
          <section className="blog-list">
            {otherPosts.map((post) => (
              <Link className="blog-list-card" key={post.id} to={`/blog/${post.slug}`}>
                <div className="blog-list-card__media">
                  <span className="blog-list-card__tag">{post.categoria}</span>
                  <img src={post.imagem} alt={post.titulo} />
                </div>

                <div className="blog-list-card__body">
                  <BlogMeta post={post} />
                  <h3>{post.titulo}</h3>
                  <p>{post.excerto}</p>
                  <span className="blog-list-card__cta">
                    Ler Mais
                    <ArrowIcon />
                  </span>
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>

      <Footer />

      {slug && <BlogDetailOverlay post={selectedPost} />}
    </>
  );
}

export default Blog;
