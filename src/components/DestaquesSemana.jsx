import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useCarouselInteractions from "../hooks/useCarouselInteractions";

const priceFormatter = new Intl.NumberFormat("pt-PT");

function DestaquesSemana({ vehicles = [], isLoading = false, error = "" }) {
  const [slideAtual, setSlideAtual] = useState(0);
  const slides = useMemo(
    () =>
      Array.from(
        { length: Math.ceil(vehicles.length / 2) },
        (_, slideIndex) => vehicles.slice(slideIndex * 2, slideIndex * 2 + 2),
      ),
    [vehicles],
  );
  const maxSlideIndex = Math.max(0, slides.length - 1);
  const visibleSlideIndex = Math.min(slideAtual, maxSlideIndex);

  function mostrarSlide(index) {
    setSlideAtual(index);
  }

  function slideAnterior() {
    setSlideAtual((atual) => {
      const safeIndex = Math.min(atual, maxSlideIndex);
      return safeIndex === 0 ? 0 : safeIndex - 1;
    });
  }

  function slideSeguinte() {
    setSlideAtual((atual) => {
      const safeIndex = Math.min(atual, maxSlideIndex);
      return safeIndex === maxSlideIndex ? safeIndex : safeIndex + 1;
    });
  }

  const { isDragging, dragOffset, interactionHandlers } =
    useCarouselInteractions({
      onPrevious: slideAnterior,
      onNext: slideSeguinte,
    });

  useEffect(() => {
    if (isDragging || slides.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setSlideAtual((atual) => {
        const safeIndex = Math.min(atual, maxSlideIndex);
        return safeIndex === maxSlideIndex ? safeIndex : safeIndex + 1;
      });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isDragging, maxSlideIndex, slides.length]);

  return (
    <section className="weekly-highlights" aria-labelledby="destaques-semana">
      <div className="weekly-highlights__header">
        <div className="weekly-highlights__heading">
          <p className="section-kicker weekly-highlights__brand">
            <span className="weekly-highlights__brand-nikita">Nikita</span>
            <span className="weekly-highlights__brand-motors">Motors</span>
          </p>
          <h2 id="destaques-semana">Destaques da Semana</h2>
          <p className="weekly-highlights__intro">
            Viaturas em destaque selecionadas para si
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="latest-vehicles__empty">
          <h3>A carregar destaques...</h3>
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="latest-vehicles__empty">
          <h3>Nao foi possivel carregar os destaques.</h3>
          <p>{error}</p>
        </div>
      ) : null}

      {!isLoading && !error && slides.length === 0 ? (
        <div className="latest-vehicles__empty">
          <h3>Sem destaques disponiveis de momento.</h3>
        </div>
      ) : null}

      {!isLoading && !error && slides.length > 0 ? (
        <>
          <div
            className={`weekly-highlights__frame${isDragging ? " is-dragging" : ""}`}
            {...interactionHandlers}
          >
            <div className="weekly-highlights__side-label">Destaques da semana</div>

            <div className="weekly-highlights__viewport">
              <div
                className="weekly-highlights__track"
                style={{
                  transform: `translate3d(calc(-${visibleSlideIndex * 100}% + ${dragOffset}px), 0, 0)`,
                }}
              >
                {slides.map((slide, slideIndex) => (
                  <div
                    className="weekly-highlights__slide"
                    key={`weekly-slide-${slideIndex}`}
                  >
                    <div className="weekly-highlights__cards">
                      {slide.map((carro) => (
                        <article
                          className="highlight-card"
                          key={`${slideIndex}-${carro.id}`}
                        >
                          <div className="highlight-card__media">
                            <img
                              src={carro.imagem}
                              alt={`${carro.marca} ${carro.modelo}`}
                              draggable="false"
                            />
                            <span className="highlight-card__badge">{carro.badgeText}</span>
                          </div>

                          <div className="highlight-card__body">
                            <p className="highlight-card__brand">{carro.marca}</p>
                            <h3>{carro.modelo}</h3>
                            <p className="highlight-card__price">
                              {priceFormatter.format(carro.preco)} EUR
                            </p>
                            <Link className="highlight-card__cta" to={carro.detailPath}>
                              Ver Detalhes
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="weekly-highlights__dots"
            aria-label="Paginas dos destaques"
          >
            {slides.map((_, index) => (
              <button
                key={index}
                className={`weekly-highlights__dot${index === visibleSlideIndex ? " is-active" : ""}`}
                type="button"
                onClick={() => mostrarSlide(index)}
                aria-label={`Mostrar slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

export default DestaquesSemana;
