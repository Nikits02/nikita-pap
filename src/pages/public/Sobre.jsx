import {
  AwardIcon,
  PeopleIcon,
  SparkIcon,
  TargetIcon,
} from "../../components/icons/CommonIcons";
import TypedIcon from "../../components/icons/TypedIcon";
import PageHero from "../../components/PageHero";
import SitePage from "../../components/SitePage";
import { buildHistoryStats, coreValues } from "../../data/about";
import useVehicles from "../../hooks/useVehicles";

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
        title="A Nossa Historia"
        description="Conheca a origem do projeto, a motivacao por tras da sua criacao e a visao que orientou o seu desenvolvimento."
      />

      <section className="about-story">
        <div className="about-story__content">
          <p>
            A NikitaMotors foi criada no ambito da Prova de Aptidao Profissional
            (PAP), com o objetivo de desenvolver um website dedicado ao mercado
            de automoveis de luxo. O projeto nasceu da vontade de aplicar, num
            caso pratico e completo, os conhecimentos adquiridos ao longo do
            curso, com especial foco no desenvolvimento web, na organizacao de
            conteudo e na experiencia do utilizador.
          </p>

          <p>
            Desde o inicio, o principal objetivo foi criar uma plataforma
            moderna, funcional e intuitiva, capaz de proporcionar uma boa
            experiencia ao utilizador. Ao longo do desenvolvimento, fui
            explorando diferentes ideias, tecnologias e solucoes para construir
            uma interface apelativa, com navegacao clara, identidade visual
            consistente e areas funcionais pensadas para diferentes tipos de
            utilizacao.
          </p>

          <p>
            Durante a realizacao do projeto, enfrentei varios desafios tecnicos,
            que me permitiram aprender e evoluir, tanto ao nivel da programacao
            como na organizacao do trabalho. Com dedicacao e esforco, fui
            consolidando competencias em frontend, estruturacao de dados,
            validacao de formularios, area administrativa e integracao entre
            interface, servidor e base de dados.
          </p>

          <p>
            Este projeto representa, assim, uma etapa importante no meu percurso
            academico, demonstrando nao apenas as competencias tecnicas que
            desenvolvi, mas tambem a minha capacidade de planear, executar e
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
          "Criar uma experiencia digital elegante, funcional e credivel, capaz
          de refletir a exigencia e o detalhe associados ao universo automovel
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
