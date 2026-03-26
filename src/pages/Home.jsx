import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DestaquesSemana from "../components/DestaquesSemana";
import PesquisaViaturas from "../components/PesquisaViaturas";
import UltimasViaturas from "../components/UltimasViaturas";
import Testemunhos from "../components/Testemunhos";
import Footer from "../components/Footer";
import useVehicles from "../hooks/useVehicles";

const initialFilters = {
  marca: "",
  modelo: "",
  combustivel: "",
  caixa: "",
};

const whyChooseItems = [
  {
    title: "Qualidade Premium",
    text: "Apenas viaturas de topo com certificacao oficial.",
    icon: "check",
  },
  {
    title: "Atendimento Excelente",
    text: "Equipa dedicada ao seu sucesso.",
    icon: "star",
  },
  {
    title: "Garantia Completa",
    text: "Protecao total durante 2 anos.",
    icon: "shield",
  },
];

function WhyChooseIcon({ type }) {
  if (type === "check") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m6.5 12.5 3.2 3.2 7.8-9.2" />
      </svg>
    );
  }

  if (type === "star") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 4.8 2.1 4.2 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.2 17 6v4.7c0 3.5-1.9 6-5 7.6-3.1-1.6-5-4.1-5-7.6V6l5-1.8Z" />
    </svg>
  );
}

function Home() {
  const navigate = useNavigate();
  const { vehicles, isLoading, error } = useVehicles();
  const stockVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.source === "stock"),
    [vehicles],
  );
  const highlightVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.source === "highlight"),
    [vehicles],
  );

  function handleVehicleSearch(filters) {
    const params = new URLSearchParams();

    if (filters.marca) {
      params.set("marca", filters.marca);
    }

    if (filters.modelo) {
      params.set("modelo", filters.modelo);
    }

    if (filters.combustivel) {
      params.set("combustivel", filters.combustivel);
    }

    if (filters.caixa) {
      params.set("caixa", filters.caixa);
    }

    const queryString = params.toString();

    navigate(queryString ? `/catalogo?${queryString}` : "/catalogo");
  }

  return (
    <>
      <Navbar />

      <main className="page-shell">
        <DestaquesSemana
          vehicles={highlightVehicles}
          isLoading={isLoading}
          error={error}
        />

        <div className="home-section-divider home-section-divider--tight" aria-hidden="true" />

        <PesquisaViaturas
          cars={vehicles}
          initialFilters={initialFilters}
          onSearch={handleVehicleSearch}
        />

        <div className="home-section-divider home-section-divider--flush" aria-hidden="true" />

        <UltimasViaturas cars={stockVehicles} />

        <div className="home-section-divider" aria-hidden="true" />

        <section className="why-choose" aria-labelledby="porque-escolher">
          <h2 id="porque-escolher">
            Porque Escolher a{" "}
            <span className="home-brand-wordmark">
              <span className="home-brand-wordmark__nikita">Nikita</span>
              <span className="home-brand-wordmark__motors">Motors</span>
            </span>
          </h2>

          <div className="why-choose__grid">
            {whyChooseItems.map((item) => (
              <article className="why-choose__card" key={item.title}>
                <div className="why-choose__icon">
                  <WhyChooseIcon type={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="home-section-divider" aria-hidden="true" />

        <Testemunhos />
      </main>

      <Footer />
    </>
  );
}

export default Home;
