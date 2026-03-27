import { useMemo } from "react";
import { Link } from "react-router-dom";
import useCarouselInteractions from "../hooks/useCarouselInteractions";
import useCarouselIndex from "../hooks/useCarouselIndex";
import { formatEuro } from "../utils/format";
import { getVehicleLabel } from "../utils/vehicle";

function DestaquesSemana({ vehicles = [], isLoading = false, error = "" }) {
  const slides = useMemo(
    () =>
      Array.from(
        { length: Math.ceil(vehicles.length / 2) },
        (_, slideIndex) => vehicles.slice(slideIndex * 2, slideIndex * 2 + 2),
      ),
    [vehicles],
  );

  const { isDragging, dragOffset, interactionHandlers, preventClickAfterDrag } =
    useCarouselInteractions({
      onPrevious: () => goPrevious(),
      onNext: () => goNext(),
    });
  const {
    setActiveIndex,
    visibleIndex: visibleSlideIndex,
    goPrevious,
    goNext,
  } = useCarouselIndex({
    itemCount: slides.length,
    autoplayDelay: 5000,
    pauseAutoplay: isDragging,
  });

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
                          <Link
                            className="highlight-card__media-link"
                            to={carro.detailPath}
                            aria-label={`Ver detalhes de ${getVehicleLabel(carro)}`}
                            draggable="false"
                            onClick={preventClickAfterDrag}
                            onDragStart={(event) => event.preventDefault()}
                          >
                            <div
                              className="highlight-card__media"
                              style={{
                                "--weekly-highlight-image": `url(${carro.imagem})`,
                              }}
                            >
                              <img
                                src={carro.imagem}
                                alt={getVehicleLabel(carro)}
                                draggable="false"
                              />
                              <span className="highlight-card__badge">{carro.badgeText}</span>
                            </div>
                          </Link>

                          <div className="highlight-card__body">
                            <div className="weekly-highlight-card__copy">
                              <p className="weekly-highlight-card__brand">{carro.marca}</p>
                              <h3 className="weekly-highlight-card__title">{carro.modelo}</h3>
                              <p className="weekly-highlight-card__price">
                                {formatEuro(carro.preco)} EUR
                              </p>
                            </div>
                            <Link
                              className="highlight-card__cta weekly-highlight-card__cta"
                              to={carro.detailPath}
                              onClick={preventClickAfterDrag}
                            >
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
                onClick={() => setActiveIndex(index)}
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
