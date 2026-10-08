import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { organizationService } from "../services/organizationService";
import type { Organization } from "../types";

const features = [
  {
    id: "email",
    name: "Email Sending",
    description: "Allow the organization to send documents and notifications by email.",
  },
  {
    id: "ai-autofill",
    name: "AI Auto-fill",
    description: "Allow AI-assisted filling and extraction of document information.",
  },
  {
    id: "google-drive",
    name: "Google Drive Integration",
    description: "Allow the organization to connect and use Google Drive.",
  },
  {
    id: "automatic-backups",
    name: "Automatic Backups",
    description: "Allow automatic backup functionality for the organization.",
  },
  {
    id: "advanced-reports",
    name: "Advanced Reports",
    description: "Allow access to advanced reporting functionality.",
  },
  {
    id: "pdf-import",
    name: "PDF Import",
    description: "Allow importing information from supported PDF documents.",
  },
];

export default function Features() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(features.map((feature) => [feature.id, true]))
  );

  useEffect(() => {
    organizationService.getAll().then((data) => {
      setOrganizations(data);

      if (data.length > 0) {
        setSelectedOrg(data[0].id);
      }
    });
  }, []);

  const toggleFeature = (id: string) => {
    setEnabled((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const selectedOrganization = organizations.find(
    (organization) => organization.id === selectedOrg
  );

  const enabledCount = features.filter(
    (feature) => enabled[feature.id]
  ).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-soft text-brand">
          <Sparkles size={20} />
        </div>

        <div>
          <h1 className="text-2xl font-semibold">Features</h1>
          <p className="text-sm text-slate-500">
            Enable or disable additional features for each organization.
          </p>
        </div>
      </div>

      {/* Organization */}
      <div className="card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="organization" className="label">
              Organization
            </label>

            <div className="relative">
              <select
                id="organization"
                value={selectedOrg}
                onChange={(event) => setSelectedOrg(event.target.value)}
                className="input w-full pl-9"
              >
                {organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full rounded-lg bg-slate-50 px-4 py-2.5 sm:w-auto dark:bg-slate-800">
            <div className="text-xs text-slate-500">
              Features enabled
            </div>

            <div className="text-sm font-semibold">
              {enabledCount} / {features.length}
            </div>
          </div>
        </div>

        {selectedOrganization && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
            <div className="text-sm font-medium">
              {selectedOrganization.name}
            </div>

            <div className="mt-0.5 text-xs text-slate-500">
              {selectedOrganization.plan} · {selectedOrganization.status}
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="card overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="font-semibold">Available Features</h2>

          <p className="mt-1 text-sm text-slate-500">
            These settings control additional functionality available to the
            organization.
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {features.map((feature) => {
            const isEnabled = enabled[feature.id];

            return (
              <div
                key={feature.id}
                className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5"
              >
                <div>
                  <div className="text-sm font-medium">
                    {feature.name}
                  </div>

                  <div className="mt-1 max-w-2xl text-xs text-slate-500">
                    {feature.description}
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isEnabled}
                  aria-label={`${isEnabled ? "Disable" : "Enable"} ${
                    feature.name
                  }`}
                  onClick={() => toggleFeature(feature.id)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    isEnabled
                      ? "bg-brand"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                      isEnabled ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800">
          <p className="text-xs text-slate-500">
            Changes are currently for UI preview only.
          </p>

          <button
            type="button"
            className="btn btn-primary w-full sm:w-auto"
            onClick={() => alert("Feature settings saved.")}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}