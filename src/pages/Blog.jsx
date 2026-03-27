import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BlogDetailOverlay from "../components/blog/BlogDetailOverlay";
import BlogPostCard from "../components/blog/BlogPostCard";
import PageHero from "../components/PageHero";
import SitePage from "../components/SitePage";
import { blogCategoryTabs } from "../data/blog";
import { blogPosts } from "../data/blogPosts";

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
      <SitePage
        mainClassName={`page-shell blog-page${slug ? " blog-page--modal-open" : ""}`}
      >
        <PageHero
          className="blog-page__hero"
          title="Blog"
          description="Artigos editoriais sobre algumas das viaturas em destaque no nosso catalogo"
        />

        <div className="blog-page__divider" />

        <section className="blog-tabs" aria-label="Filtros do blog">
          {blogCategoryTabs.map((category) => (
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
            <BlogPostCard post={featuredPost} featured />
          </section>
        )}

        {otherPosts.length > 0 && (
          <section className="blog-list">
            {otherPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </section>
        )}
      </SitePage>

      {slug && <BlogDetailOverlay post={selectedPost} />}
    </>
  );
}

export default Blog;
