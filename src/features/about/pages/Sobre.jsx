import {
  AwardIcon,
  PeopleIcon,
  SparkIcon,
  TargetIcon,
} from "../../../shared/components/icons/CommonIcons";
import TypedIcon from "../../../shared/components/icons/TypedIcon";
import { PageHero, SitePage } from "../../../shared/components/ui";
import { buildHistoryStats, coreValues } from "../data/about";
import useVehicles from "../../vehicles/hooks/useVehicles";

const valueIcons = {
  award: AwardIcon,
  people: PeopleIcon,
  spark: SparkIcon,
  target: TargetIcon,
};

function Sobre() {
  const { vehicles, isLoading, error } = useVehicles();
  const historyStats = buildHistoryStats(
    isLoading ? "..." : error ? "-" : String(vehicles.length),
  );

  return (
    <SitePage mainClassName="page-shell about-page">
      <PageHero
        className="about-page__hero"
        title="A Nossa História"
        description="Conheça a origem do projeto, a motivação por trás da sua criação e a visão que orientou o seu desenvolvimento."
      />

      <section className="about-story">
        <div className="about-story__content">
          <p>
            A NikitaMotors foi criada no âmbito da Prova de Aptidão Profissional
            (PAP), com o objetivo de desenvolver um website dedicado ao mercado
            de automóveis de luxo. O projeto nasceu da vontade de aplicar, num
            caso prático e completo, os conhecimentos adquiridos ao longo do
            curso, com especial foco no desenvolvimento web, na organização de
            conteúdo e na experiência do utilizador.
          </p>

          <p>
            Desde o início, o principal objetivo foi criar uma plataforma
            moderna, funcional e intuitiva, capaz de proporcionar uma boa
            experiência ao utilizador. Ao longo do desenvolvimento, fui
            explorando diferentes ideias, tecnologias e soluções para construir
            uma interface apelativa, com navegação clara, identidade visual
            consistente e áreas funcionais pensadas para diferentes tipos de
            utilização.
          </p>

          <p>
            Durante a realização do projeto, enfrentei vários desafios técnicos,
            que me permitiram aprender e evoluir, tanto ao nível da programação
            como na organização do trabalho. Com dedicação e esforço, fui
            consolidando competências em frontend, estruturação de dados,
            validação de formulários, área administrativa e integração entre
            interface, servidor e base de dados.
          </p>

          <p>
            Este projeto representa, assim, uma etapa importante no meu percurso
            académico, demonstrando não apenas as competências técnicas que
            desenvolvi, mas também a minha capacidade de planear, executar e
            melhorar um produto digital de forma progressiva.
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
          "Criar uma experiência digital elegante, funcional e credível, capaz
          de refletir a exigência e o detalhe associados ao universo automóvel
          premium."
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
