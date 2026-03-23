import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { destaquesSemana } from "../data/destaquesSemana";
import { getVehicleDetailPath } from "../data/vehicleInventory";
import useCarouselInteractions from "../hooks/useCarouselInteractions";

const priceFormatter = new Intl.NumberFormat("pt-PT");

const slides = Array.from(
  { length: Math.ceil(destaquesSemana.length / 2) },
  (_, slideIndex) => destaquesSemana.slice(slideIndex * 2, slideIndex * 2 + 2),
);

function DestaquesSemana() {
  const navigate = useNavigate();
  const [slideAtual, setSlideAtual] = useState(0);

  function mostrarSlide(index) {
    setSlideAtual(index);
  }

  function slideAnterior() {
    setSlideAtual((atual) => (atual === 0 ? 0 : atual - 1));
  }

  function slideSeguinte() {
    setSlideAtual((atual) => (atual === slides.length - 1 ? atual : atual + 1));
  }

  function abrirDetalhes(carro) {
    navigate(getVehicleDetailPath(carro, "highlight"));
  }

  const {
    isDragging,
    dragOffset,
    preventClickAfterDrag,
    interactionHandlers,
  } = useCarouselInteractions({
    onPrevious: slideAnterior,
    onNext: slideSeguinte,
  });

  useEffect(() => {
    if (isDragging) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setSlideAtual((atual) => (atual === slides.length - 1 ? atual : atual + 1));
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isDragging]);

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

      <div
        className={`weekly-highlights__frame${isDragging ? " is-dragging" : ""}`}
        {...interactionHandlers}
      >
        <div className="weekly-highlights__side-label">Destaques da semana</div>

        <div className="weekly-highlights__viewport">
          <div
            className="weekly-highlights__track"
            style={{
              transform: `translate3d(calc(-${slideAtual * 100}% + ${dragOffset}px), 0, 0)`,
            }}
          >
            {slides.map((slide, slideIndex) => (
              <div className="weekly-highlights__slide" key={`weekly-slide-${slideIndex}`}>
                <div className="weekly-highlights__cards">
                  {slide.map((carro) => (
                    <article
                      className="highlight-card"
                      key={`${slideIndex}-${carro.id}`}
                      role="link"
                      tabIndex={0}
                      aria-label={`Ver detalhes de ${carro.marca} ${carro.modelo}`}
                      onClick={(event) => {
                        preventClickAfterDrag(event);

                        if (event.defaultPrevented) {
                          return;
                        }

                        abrirDetalhes(carro);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          abrirDetalhes(carro);
                        }
                      }}
                      onDragStart={(event) => event.preventDefault()}
                    >
                      <div className="highlight-card__media">
                        <img
                          src={carro.imagem}
                          alt={`${carro.marca} ${carro.modelo}`}
                          draggable="false"
                        />
                        <span className="highlight-card__badge">Novo</span>
                      </div>

                      <div className="highlight-card__body">
                        <p className="highlight-card__brand">{carro.marca}</p>
                        <h3>{carro.modelo}</h3>
                        <p className="highlight-card__price">
                          {priceFormatter.format(carro.preco)} EUR
                        </p>
                        <span className="highlight-card__cta">
                          Ver Detalhes
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="weekly-highlights__dots" aria-label="Paginas dos destaques">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`weekly-highlights__dot${index === slideAtual ? " is-active" : ""}`}
            type="button"
            onClick={() => mostrarSlide(index)}
            aria-label={`Mostrar slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default DestaquesSemana;
