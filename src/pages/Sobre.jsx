import {
  AwardIcon,
  PeopleIcon,
  SparkIcon,
  TargetIcon,
} from "../components/icons/CommonIcons";
import TypedIcon from "../components/icons/TypedIcon";
import PageHero from "../components/PageHero";
import SitePage from "../components/SitePage";
import { coreValues, historyStats } from "../data/about";

const valueIcons = {
  award: AwardIcon,
  people: PeopleIcon,
  spark: SparkIcon,
  target: TargetIcon,
};

function Sobre() {
  return (
    <SitePage mainClassName="page-shell about-page">
      <PageHero
        className="about-page__hero"
        title="A Nossa Historia"
        description="Conheca o percurso, a motivacao e a visao por tras da NikitaMotors."
      />

      <section className="about-story">
        <div className="about-story__content">
          <p>
            A NikitaMotors foi criada no Ammbito da Prova de Aptidão
            Profissional (PAP), com o objetivo de desenvolver um website
            dedicado ao mercado de automóveis de luxo. Este projeto surgiu da
            minha motivação em aplicar os conhecimentos adquiridos ao longo do
            curso, especialmente na área do desenvolvimento web.
          </p>

          <p>
            Desde o início, o principal objetivo foi criar uma plataforma
            moderna, funcional e intuitiva, capaz de proporcionar uma boa
            experiência ao utilizador. Ao longo do desenvolvimento, fui
            explorando diferentes ideias, tecnologias e soluções, sempre com o
            intuito de melhorar o design e as funcionalidades do website.
          </p>

          <p>
            Durante a realização do projeto, enfrentei vários desafios técnicos,
            que me permitiram aprender e evoluir, tanto ao ni­vel da programação
            como na organizacão do trabalho. Com dedicaçã e esforço, consegui
            desenvolver um website que reflete nã só os conhecimentos
            adquiridos, mas também o meu interesse pela áera e vontade de
            aprender mais.
          </p>

          <p>
            Este projeto representa, assim, uma etapa importante no meu percurso
            académico, demonstrando as competências que desenvolvi ao longo da
            minha formacão.
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
              <div
                className={`about-values__icon about-values__icon--${item.icon}`}
              >
                <TypedIcon
                  type={item.icon}
                  icons={valueIcons}
                  fallback={TargetIcon}
                />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </SitePage>
  );
}

export default Sobre;
