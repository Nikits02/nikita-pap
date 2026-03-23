import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const historyStats = [
  { value: "2026", label: "Ano de Fundacao" },
  { value: "120+", label: "Veiculos em Stock" },
  { value: "2.400+", label: "Clientes Satisfeitos" },
  { value: "98%", label: "Taxa de Satisfacao" },
];

const coreValues = [
  {
    title: "Excelencia",
    text: "Nunca comprometemos a qualidade em nenhum aspeto do nosso servico.",
    icon: "award",
  },
  {
    title: "Confianca",
    text: "Transparencia e honestidade em cada transacao e interacao.",
    icon: "people",
  },
  {
    title: "Paixao",
    text: "O amor pelos automoveis de luxo esta no ADN de toda a nossa equipa.",
    icon: "spark",
  },
  {
    title: "Inovacao",
    text: "Adotamos sempre as mais recentes tecnologias e metodologias.",
    icon: "target",
  },
];

function ValueIcon({ type }) {
  if (type === "award") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="9" r="3.2" />
        <path d="M9.6 12.2 8.5 19l3.5-1.9 3.5 1.9-1.1-6.8" />
      </svg>
    );
  }

  if (type === "people") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="9.2" r="2.6" />
        <circle cx="15.8" cy="10.2" r="2.1" />
        <path d="M4.8 18c.7-2.7 2.4-4.2 4.9-4.2s4.2 1.5 4.9 4.2" />
        <path d="M14.1 17.5c.4-1.8 1.6-2.9 3.5-2.9 1.1 0 2 .3 2.6 1" />
      </svg>
    );
  }

  if (type === "spark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m13.5 3-7 9h4l-1 9 7-10h-4l1-8Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="6.8" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  );
}

function Sobre() {
  return (
    <>
      <Navbar />

      <main className="page-shell">
        <section className="about-story">
          <div className="about-story__content">
            <h1>A Nossa Historia</h1>

            <p>
              A NikitaMotors foi criada no âmbito da Prova de Aptidão Profissional 
              (PAP), com o objetivo de desenvolver um website dedicado ao 
              mercado de automóveis de luxo. Este projeto surgiu da minha motivação 
              em aplicar os conhecimentos adquiridos ao longo do curso, especialmente 
              na área do desenvolvimento web.
            </p>

            <p>
              Desde o início, o principal objetivo foi criar uma plataforma moderna, 
              funcional e intuitiva, capaz de proporcionar uma boa experiência ao 
              utilizador. Ao longo do desenvolvimento, fui explorando diferentes ideias, 
              tecnologias e soluções, sempre com o intuito de melhorar o design 
              e as funcionalidades do website.
            </p>

            <p>
              Durante a realização do projeto, enfrentei vários desafios técnicos, que me 
              permitiram aprender e evoluir, tanto ao nível da programação como na 
              organização do trabalho. Com dedicação e esforço, consegui desenvolver um 
              website que reflete não só os conhecimentos adquiridos, mas também o 
              meu interesse pela área e vontade de aprender mais.
            </p>

            <p> 
              Este projeto representa, assim, uma etapa importante no meu percurso académico, 
              demonstrando as competências que desenvolvi ao longo da minha formação.
            </p>
          </div>

          <div className="about-story__stats">
            {historyStats.map((item) => (
              <article className="about-story__stat" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="about-quote" aria-label="Mensagem da marca">
          <div className="about-quote__mark" aria-hidden="true" />
          <blockquote>
            "Proporcionar a cada cliente uma experiencia de aquisicao automovel
            verdadeiramente premium, com transparencia, confianca e dedicacao
            total."
          </blockquote>
          <p>- Nikita Kazutinas, CEO</p>
        </section>

        <section className="about-values" aria-labelledby="o-que-nos-define">
          <div className="about-values__heading">
            <p>Os Nossos Valores</p>
            <h2 id="o-que-nos-define">O Que Nos Define</h2>
          </div>

          <div className="about-values__grid">
            {coreValues.map((item) => (
              <article className="about-values__card" key={item.title}>
                <div className={`about-values__icon about-values__icon--${item.icon}`}>
                  <ValueIcon type={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Sobre;
