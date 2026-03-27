import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BrandWordmark from "../components/BrandWordmark";
import DestaquesSemana from "../components/DestaquesSemana";
import {
  CheckMarkIcon,
  ShieldIcon,
  StarIcon,
} from "../components/icons/CommonIcons";
import TypedIcon from "../components/icons/TypedIcon";
import PesquisaViaturas from "../components/PesquisaViaturas";
import SectionDivider from "../components/SectionDivider";
import UltimasViaturas from "../components/UltimasViaturas";
import Testemunhos from "../components/Testemunhos";
import { homeInitialFilters, whyChooseItems } from "../data/home";
import SitePage from "../components/SitePage";
import useVehicles from "../hooks/useVehicles";

const whyChooseIcons = {
  check: CheckMarkIcon,
  shield: ShieldIcon,
  star: StarIcon,
};

function Home() {
  const navigate = useNavigate();
  const { vehicles, isLoading, error } = useVehicles();
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
    <SitePage>
      <DestaquesSemana
        vehicles={highlightVehicles}
        isLoading={isLoading}
        error={error}
      />

      <SectionDivider variant="tight" />

      <PesquisaViaturas
        cars={vehicles}
        initialFilters={homeInitialFilters}
        onSearch={handleVehicleSearch}
      />

      <SectionDivider variant="flush" />

      <UltimasViaturas cars={vehicles} />

      <SectionDivider />

      <section className="why-choose" aria-labelledby="porque-escolher">
        <h2 id="porque-escolher">
          Porque Escolher a <BrandWordmark />
        </h2>

        <div className="why-choose__grid">
          {whyChooseItems.map((item) => (
            <article className="why-choose__card" key={item.title}>
              <div className="why-choose__icon">
                <TypedIcon
                  type={item.icon}
                  icons={whyChooseIcons}
                  fallback={ShieldIcon}
                />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <SectionDivider />

      <Testemunhos />
    </SitePage>
  );
}

export default Home;
