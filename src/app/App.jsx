import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AppRouteEffects,
  ProtectedAdminRoute,
  ProtectedAuthRoute,
  SessionStatus,
} from "../shared/components/routing";
import { AuthProvider } from "../features/auth/context/AuthContext";

const AdminContactMessages = lazy(
  () => import("../features/admin/pages/AdminContactMessages"),
);
const AdminFinanceRequests = lazy(
  () => import("../features/admin/pages/AdminFinanceRequests"),
);
const AdminDashboard = lazy(() => import("../features/admin/pages/AdminDashboard"));
const AdminLogin = lazy(() => import("../features/admin/pages/AdminLogin"));
const AdminTestDrives = lazy(() => import("../features/admin/pages/AdminTestDrives"));
const AdminTradeIns = lazy(() => import("../features/admin/pages/AdminTradeIns"));
const AdminUsers = lazy(() => import("../features/admin/pages/AdminUsers"));
const AdminVehicleForm = lazy(() => import("../features/admin/pages/AdminVehicleForm"));
const AdminVehicles = lazy(() => import("../features/admin/pages/AdminVehicles"));
const Blog = lazy(() => import("../features/blog/pages/Blog"));
const Catalogo = lazy(() => import("../features/vehicles/pages/Catalogo"));
const Contacto = lazy(() => import("../features/contact/pages/Contacto"));
const Conta = lazy(() => import("../features/auth/pages/Conta"));
const Financiamento = lazy(() => import("../features/finance/pages/Financiamento"));
const Home = lazy(() => import("../features/home/pages/Home"));
const Login = lazy(() => import("../features/auth/pages/Login"));
const NotFound = lazy(() => import("../features/not-found/pages/NotFound"));
const Registo = lazy(() => import("../features/auth/pages/Registo"));
const Retoma = lazy(() => import("../features/trade-in/pages/Retoma"));
const Sobre = lazy(() => import("../features/about/pages/Sobre"));
const TestDrive = lazy(() => import("../features/test-drive/pages/TestDrive"));
const VeiculoDetalhe = lazy(() => import("../features/vehicles/pages/VeiculoDetalhe"));

const rotasPublicas = [
  { path: "/", element: <Home /> },
  { path: "/catalogo", element: <Catalogo /> },
  { path: "/viaturas/:slug", element: <VeiculoDetalhe /> },
  { path: "/contacto", element: <Contacto /> },
  { path: "/blog", element: <Blog /> },
  { path: "/blog/:slug", element: <Blog /> },
  { path: "/sobre", element: <Sobre /> },
  { path: "/registo", element: <Registo /> },
  { path: "/login", element: <Login /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "*", element: <NotFound /> },
];

const rotasAutenticadas = [
  { path: "/financiamento", element: <Financiamento /> },
  { path: "/retoma", element: <Retoma /> },
  { path: "/test-drive", element: <TestDrive /> },
  { path: "/conta", element: <Conta /> },
];

const rotasAdmin = [
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/admin/viaturas", element: <AdminVehicles /> },
  { path: "/admin/retomas", element: <AdminTradeIns /> },
  { path: "/admin/utilizadores", element: <AdminUsers /> },
  { path: "/admin/contactos", element: <AdminContactMessages /> },
  { path: "/admin/financiamentos", element: <AdminFinanceRequests /> },
  { path: "/admin/test-drives", element: <AdminTestDrives /> },
  { path: "/admin/viaturas/nova", element: <AdminVehicleForm /> },
  { path: "/admin/viaturas/:id/editar", element: <AdminVehicleForm /> },
];

function getRouteLoadingFallback(variant = "public") {
  return (
    <SessionStatus
      variant={variant}
      title="A carregar página..."
      message="Estamos a preparar o conteúdo."
    />
  );
}

function renderRoutes(
  routes,
  wrapElement = (element) => element,
  loadingVariant = "public",
) {
  return routes.map(({ path, element }) => (
    <Route
      key={path}
      path={path}
      element={
        <Suspense fallback={getRouteLoadingFallback(loadingVariant)}>
          {wrapElement(element)}
        </Suspense>
      }
    />
  ));
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouteEffects />
        <Routes>
          {renderRoutes(rotasPublicas)}
          {renderRoutes(
            rotasAutenticadas,
            (element) => <ProtectedAuthRoute>{element}</ProtectedAuthRoute>,
          )}
          {renderRoutes(
            rotasAdmin,
            (element) => <ProtectedAdminRoute>{element}</ProtectedAdminRoute>,
            "admin",
          )}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
