import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AdminLayout from "./components/layout/admin-layout";
import Dashboard from "./pages/dashboard";
import Organizations from "./pages/organizations";
import CreateOrganization from "./pages/create-organization";
import Coming from "./pages/coming";
import Subscriptions from "./pages/subscriptions";
import AccessControl from "./pages/access-control";
import Features from "./pages/features";
import Usage from "./pages/usage";
import AuditLogs from "./pages/audit-logs";
import Support from "./pages/support";
import Settings from "./pages/settings";
import Login from "./pages/login";
import { AuthProvider, useAuth } from "./auth/auth-context";

const rest = [
  ["profile", "Profile"],
  ["organizations/:id", "Organization Details"],
];

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <AdminLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="organizations" element={<Organizations />} />
          <Route
            path="organizations/new"
            element={<CreateOrganization />}
          />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route
            path="access-control"
            element={<AccessControl />}
          />
          <Route path="features" element={<Features />} />
          <Route path="usage" element={<Usage />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<Settings />} />

          {rest.map(([path, title]) => (
            <Route
              key={path}
              path={path}
              element={<Coming title={title} />}
            />
          ))}
        </Route>
      </Routes>
    </AuthProvider>
  );
}