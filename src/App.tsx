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
import EditOrganization from "./pages/edit-organization";

const rest = [
  ["profile", "Profile"],
  ["organizations/:id", "Organization Details"],
];

function ProtectedLayout() {
  const {
    isAuthenticated,
    isPlatformAdmin,
    isLoading,
    authError,
    logout,
  } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Verifying platform access…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" replace state={{ from: location }} />
    );
  }

  if (!isPlatformAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-semibold">
            Platform access denied
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            {authError ||
              "Your account does not have platform administrator access."}
          </p>
          <button
            type="button"
            className="btn btn-primary mt-6"
            onClick={() => void logout()}
          >
            Sign out
          </button>
        </div>
      </div>
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
          <Route
            path="organizations/:id/edit"
            element={<EditOrganization />}
          />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="access-control" element={<AccessControl />} />
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
