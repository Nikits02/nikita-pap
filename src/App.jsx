import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Contacto from "./pages/Contacto";
import Financiamento from "./pages/Financiamento";
import Blog from "./pages/Blog";
import Registo from "./pages/Registo";
import Retoma from "./pages/Retoma";
import Sobre from "./pages/Sobre";
import VeiculoDetalhe from "./pages/VeiculoDetalhe";
import TestDrive from "./pages/TestDrive";

function RouteScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      return;
    }

    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname, location.hash]);

  return null;
}

function HashScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return undefined;
    }

    const targetId = location.hash.slice(1);
    let attempts = 0;
    let timeoutId;

    const scrollToHash = () => {
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ block: "start" });
        return;
      }

      if (attempts >= 20) {
        return;
      }

      attempts += 1;
      timeoutId = window.setTimeout(scrollToHash, 80);
    };

    timeoutId = window.setTimeout(scrollToHash, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.hash, location.pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <RouteScrollManager />
      <HashScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/financiamento" element={<Financiamento />} />
        <Route path="/retoma" element={<Retoma />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Blog />} />
        <Route path="/viaturas/:slug" element={<VeiculoDetalhe />} />
        <Route path="/test-drive" element={<TestDrive />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/registo" element={<Registo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
