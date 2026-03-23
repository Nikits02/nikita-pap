import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Registo() {
  return (
    <>
      <Navbar />

      <main className="page-shell">
        <section className="page-hero">
          <p className="section-kicker">Area de cliente</p>
          <h1>Registo</h1>
          <p className="page-hero__text">
            Esta pagina ficou alinhada com o novo header para manter a imagem do
            site consistente em todas as rotas.
          </p>
        </section>

        <section className="info-card page-copy">
          <h2>Criar conta</h2>
          <p>
            Podes usar esta zona mais tarde para colocar o formulario de registo
            dos teus clientes.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Registo;
