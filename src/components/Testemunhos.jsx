import { useEffect, useState } from "react";
import { resumoTestemunhos, testemunhos } from "../data/testemunhos";
import useCarouselIndex from "../hooks/useCarouselIndex";
import useCarouselInteractions from "../hooks/useCarouselInteractions";

const STAR_COUNT = 5;

function getCardsPerView() {
  if (typeof window === "undefined") {
    return 4;
  }

  if (window.innerWidth <= 760) {
    return 1;
  }

  if (window.innerWidth <= 1080) {
    return 2;
  }

  if (window.innerWidth <= 1320) {
    return 3;
  }

  return 4;
}

function GoogleMark() {
  return (
    <span className="testimonial-card__google" aria-hidden="true">
      G
    </span>
  );
}

function Testemunhos() {
  const [cardsPerView, setCardsPerView] = useState(getCardsPerView);
  const itemStep = 100 / cardsPerView;

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { isDragging, dragOffset, interactionHandlers } = useCarouselInteractions({
    onPrevious: () => goPrevious(),
    onNext: () => goNext(),
  });
  const {
    maxIndex,
    setActiveIndex,
    visibleIndex,
    goPrevious,
    goNext,
  } = useCarouselIndex({
    itemCount: testemunhos.length,
    visibleCount: cardsPerView,
    loop: true,
    autoplayDelay: 5000,
    pauseAutoplay: isDragging,
  });

  return (
    <section className="testimonials-section" aria-labelledby="testemunhos">
      <div className="testimonials-section__shell">
        <div className="testimonials-section__heading">
          <p className="testimonials-section__eyebrow">Testemunhos</p>
          <h2 id="testemunhos">O Que Dizem os Nossos Clientes</h2>
        </div>

        <p className="testimonials-section__summary">
          <span>Avaliacao de</span>
          <strong>{resumoTestemunhos.avaliacao.toFixed(1)}</strong>
          <span className="testimonials-section__star" aria-hidden="true">
            &#9733;
          </span>
          <span>com base em</span>
          <strong>{resumoTestemunhos.reviews}</strong>
          <span>reviews</span>
        </p>

        <div
          className={`testimonials-section__viewport${isDragging ? " is-dragging" : ""}`}
          style={{ "--testimonials-per-view": cardsPerView }}
          {...interactionHandlers}
        >
          <div className="testimonials-section__viewport-window">
            <div
              className="testimonials-section__track"
              style={{
                transform: `translate3d(calc(-${visibleIndex * itemStep}% + ${dragOffset}px), 0, 0)`,
              }}
            >
              {testemunhos.map((testemunho) => (
                <div
                  className="testimonials-section__slide testimonials-section__slide--item"
                  key={`${testemunho.nome}-${testemunho.data}`}
                >
                  <article className="testimonial-card">
                    <div
                      className="testimonial-card__avatar"
                      style={{ backgroundColor: testemunho.cor }}
                      aria-hidden="true"
                    >
                      {testemunho.iniciais}
                    </div>

                    <h3>{testemunho.nome}</h3>

                    <div className="testimonial-card__stars" aria-label={`${STAR_COUNT} estrelas`}>
                      {Array.from({ length: STAR_COUNT }, (_, index) => (
                        <span key={index}>&#9733;</span>
                      ))}
                    </div>

                    <p className="testimonial-card__date">{testemunho.data}</p>
                    <p className="testimonial-card__text">{testemunho.texto}</p>

                    <div className="testimonial-card__footer">
                      <GoogleMark />
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>

        {maxIndex > 0 && (
          <div className="testimonials-section__dots" aria-label="Paginas de testemunhos">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                type="button"
                key={`testimonial-dot-${index}`}
                className={`testimonials-section__dot${index === visibleIndex ? " is-active" : ""}`}
                aria-label={`Mostrar testemunhos ${index + 1}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Testemunhos;
