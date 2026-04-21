import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminContactMessages from "./pages/admin/AdminContactMessages";
import AdminFinanceRequests from "./pages/admin/AdminFinanceRequests";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminTestDrives from "./pages/admin/AdminTestDrives";
import AdminTradeIns from "./pages/admin/AdminTradeIns";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVehicleForm from "./pages/admin/AdminVehicleForm";
import AdminVehicles from "./pages/admin/AdminVehicles";
import Conta from "./pages/auth/Conta";
import Login from "./pages/auth/Login";
import Registo from "./pages/auth/Registo";
import Blog from "./pages/public/Blog";
import Catalogo from "./pages/public/Catalogo";
import Contacto from "./pages/public/Contacto";
import Financiamento from "./pages/public/Financiamento";
import Home from "./pages/public/Home";
import NotFound from "./pages/public/NotFound";
import Retoma from "./pages/public/Retoma";
import Sobre from "./pages/public/Sobre";
import TestDrive from "./pages/public/TestDrive";
import VeiculoDetalhe from "./pages/public/VeiculoDetalhe";
import ProtectedAuthRoute from "./components/ProtectedAuthRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AppRouteEffects from "./components/AppRouteEffects";
import { AuthProvider } from "./context/AuthContext";

const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/contacto", element: <Contacto /> },
  { path: "/blog", element: <Blog /> },
  { path: "/blog/:slug", element: <Blog /> },
  { path: "/test-drive", element: <TestDrive /> },
  { path: "/sobre", element: <Sobre /> },
  { path: "/registo", element: <Registo /> },
  { path: "/login", element: <Login /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "*", element: <NotFound /> },
];

const authRoutes = [
  { path: "/catalogo", element: <Catalogo /> },
  { path: "/financiamento", element: <Financiamento /> },
  { path: "/retoma", element: <Retoma /> },
  { path: "/viaturas/:slug", element: <VeiculoDetalhe /> },
  { path: "/conta", element: <Conta /> },
];

const adminRoutes = [
  { path: "/admin/viaturas", element: <AdminVehicles /> },
  { path: "/admin/retomas", element: <AdminTradeIns /> },
  { path: "/admin/utilizadores", element: <AdminUsers /> },
  { path: "/admin/contactos", element: <AdminContactMessages /> },
  { path: "/admin/financiamentos", element: <AdminFinanceRequests /> },
  { path: "/admin/test-drives", element: <AdminTestDrives /> },
  { path: "/admin/viaturas/nova", element: <AdminVehicleForm /> },
  { path: "/admin/viaturas/:id/editar", element: <AdminVehicleForm /> },
];

function renderRoutes(routes, wrapElement = (element) => element) {
  return routes.map(({ path, element }) => (
    <Route key={path} path={path} element={wrapElement(element)} />
  ));
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouteEffects />
        <Routes>
          {renderRoutes(publicRoutes)}
          {renderRoutes(
            authRoutes,
            (element) => <ProtectedAuthRoute>{element}</ProtectedAuthRoute>,
          )}
          {renderRoutes(
            adminRoutes,
            (element) => <ProtectedAdminRoute>{element}</ProtectedAdminRoute>,
          )}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
