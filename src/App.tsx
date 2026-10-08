import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/layout/admin-layout";
import Dashboard from "./pages/dashboard";
import Organizations from "./pages/organizations";
import CreateOrganization from "./pages/create-organization";
import Coming from "./pages/coming";
import Subscriptions from "./pages/subscriptions";

const rest = [
  ["users", "Users"],
  ["access-control", "Access Control"],
  ["features", "Features"],
  ["usage", "Usage & Limits"],
  ["audit-logs", "Audit Logs"],
  ["support", "Support"],
  ["settings", "Settings"],
  ["profile", "Profile"],
  ["organizations/:id", "Organization Details"],
];

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="organizations/new" element={<CreateOrganization />} />
        <Route path="subscriptions" element={<Subscriptions />} />

        {rest.map(([p, t]) => (
          <Route key={p} path={p} element={<Coming title={t} />} />
        ))}
      </Route>
    </Routes>
  );
}