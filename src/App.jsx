import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import Login from "./pages/Login";
import Conta from "./pages/Conta";
import AdminLogin from "./pages/AdminLogin";
import AdminVehicles from "./pages/AdminVehicles";
import AdminVehicleForm from "./pages/AdminVehicleForm";
import AdminTradeIns from "./pages/AdminTradeIns";
import AdminUsers from "./pages/AdminUsers";
import AdminContactMessages from "./pages/AdminContactMessages";
import ProtectedAuthRoute from "./components/ProtectedAuthRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AppRouteEffects from "./components/AppRouteEffects";

function App() {
  return (
    <BrowserRouter>
      <AppRouteEffects />
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
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/conta"
          element={
            <ProtectedAuthRoute>
              <Conta />
            </ProtectedAuthRoute>
          }
        />
        <Route
          path="/admin/viaturas"
          element={
            <ProtectedAdminRoute>
              <AdminVehicles />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/retomas"
          element={
            <ProtectedAdminRoute>
              <AdminTradeIns />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/utilizadores"
          element={
            <ProtectedAdminRoute>
              <AdminUsers />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/contactos"
          element={
            <ProtectedAdminRoute>
              <AdminContactMessages />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/viaturas/nova"
          element={
            <ProtectedAdminRoute>
              <AdminVehicleForm />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/viaturas/:id/editar"
          element={
            <ProtectedAdminRoute>
              <AdminVehicleForm />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
