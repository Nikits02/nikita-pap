import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedAuthRoute from "./components/ProtectedAuthRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AppRouteEffects from "./components/AppRouteEffects";
import SessionStatus from "./components/SessionStatus";
import { AuthProvider } from "./context/AuthContext";

const AdminContactMessages = lazy(
  () => import("./pages/admin/AdminContactMessages"),
);
const AdminFinanceRequests = lazy(
  () => import("./pages/admin/AdminFinanceRequests"),
);
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminTestDrives = lazy(() => import("./pages/admin/AdminTestDrives"));
const AdminTradeIns = lazy(() => import("./pages/admin/AdminTradeIns"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminVehicleForm = lazy(() => import("./pages/admin/AdminVehicleForm"));
const AdminVehicles = lazy(() => import("./pages/admin/AdminVehicles"));
const Blog = lazy(() => import("./pages/public/Blog"));
const Catalogo = lazy(() => import("./pages/public/Catalogo"));
const Contacto = lazy(() => import("./pages/public/Contacto"));
const Conta = lazy(() => import("./pages/auth/Conta"));
const Financiamento = lazy(() => import("./pages/public/Financiamento"));
const Home = lazy(() => import("./pages/public/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const NotFound = lazy(() => import("./pages/public/NotFound"));
const Registo = lazy(() => import("./pages/auth/Registo"));
const Retoma = lazy(() => import("./pages/public/Retoma"));
const Sobre = lazy(() => import("./pages/public/Sobre"));
const TestDrive = lazy(() => import("./pages/public/TestDrive"));
const VeiculoDetalhe = lazy(() => import("./pages/public/VeiculoDetalhe"));

const publicRoutes = [
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

const authRoutes = [
  { path: "/financiamento", element: <Financiamento /> },
  { path: "/retoma", element: <Retoma /> },
  { path: "/test-drive", element: <TestDrive /> },
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
          {renderRoutes(publicRoutes)}
          {renderRoutes(
            authRoutes,
            (element) => <ProtectedAuthRoute>{element}</ProtectedAuthRoute>,
          )}
          {renderRoutes(
            adminRoutes,
            (element) => <ProtectedAdminRoute>{element}</ProtectedAdminRoute>,
            "admin",
          )}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
