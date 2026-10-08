import { useEffect, useState } from "react";
import { Building2, Gauge } from "lucide-react";
import { organizationService } from "../services/organizationService";
import type { Organization } from "../types";

type Limit = {
  id: string;
  name: string;
  description: string;
  unit: string;
  value: string;
  used: number;
};

const initialLimits: Limit[] = [
  {
    id: "invoices",
    name: "Invoices",
    description: "Maximum invoices that can be created per month.",
    unit: "invoices / month",
    value: "1000",
    used: 742,
  },
  {
    id: "proforma",
    name: "Proforma Invoices",
    description: "Maximum proforma invoices that can be created per month.",
    unit: "documents / month",
    value: "500",
    used: 186,
  },
  {
    id: "quotations",
    name: "Quotations",
    description: "Maximum quotations that can be created per month.",
    unit: "documents / month",
    value: "1000",
    used: 421,
  },
  {
    id: "emails",
    name: "Emails",
    description: "Maximum emails that can be sent per month.",
    unit: "emails / month",
    value: "500",
    used: 184,
  },
  {
    id: "ai-autofill",
    name: "AI Auto-fill",
    description: "Maximum AI-assisted operations allowed per month.",
    unit: "operations / month",
    value: "100",
    used: 38,
  },
  {
    id: "storage",
    name: "Storage",
    description: "Maximum storage available to the organization.",
    unit: "GB",
    value: "10",
    used: 4,
  },
];

export default function Usage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [limits, setLimits] = useState<Limit[]>(initialLimits);

  useEffect(() => {
    organizationService.getAll().then((data) => {
      setOrganizations(data);

      if (data.length > 0) {
        setSelectedOrg(data[0].id);
      }
    });
  }, []);

  const selectedOrganization = organizations.find(
    (organization) => organization.id === selectedOrg
  );

  const updateLimit = (id: string, value: string) => {
    setLimits((current) =>
      current.map((limit) =>
        limit.id === id ? { ...limit, value } : limit
      )
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
          <Gauge size={20} />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Usage & Limits</h1>
          <p className="text-sm text-slate-500">
            Configure usage limits and monitor resource consumption for each
            organization.
          </p>
        </div>
      </div>

      {/* Organization */}
      <div className="card p-4 sm:p-5">
        <label htmlFor="organization" className="label">
          Organization
        </label>

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

      {/* Limits */}
      <div className="card overflow-hidden">
        <div className="border-b border-slate-200 px-4 py-4 sm:px-5 dark:border-slate-800">
          <h2 className="font-semibold">Usage Limits</h2>

          <p className="mt-1 text-sm text-slate-500">
            Configure the maximum usage allowed for this organization.
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {limits.map((limit) => {
            const maximum = Number(limit.value) || 0;

            const percentage =
              maximum > 0
                ? Math.min((limit.used / maximum) * 100, 100)
                : 0;

            const warning = percentage >= 80;

            return (
              <div key={limit.id} className="px-4 py-5 sm:px-5">
                {/* Limit heading + input */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">
                      {limit.name}
                    </div>

                    <div className="mt-1 text-xs leading-5 text-slate-500">
                      {limit.description}
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-1.5 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <label
                      htmlFor={`limit-${limit.id}`}
                      className="text-xs text-slate-500 sm:sr-only"
                    >
                      Maximum limit
                    </label>

                    <input
                      id={`limit-${limit.id}`}
                      type="number"
                      min="0"
                      value={limit.value}
                      onChange={(event) =>
                        updateLimit(limit.id, event.target.value)
                      }
                      className="input w-full sm:w-32"
                    />

                    <span className="text-xs text-slate-500 sm:w-36">
                      {limit.unit}
                    </span>
                  </div>
                </div>

                {/* Usage */}
                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-500">
                      Current usage
                    </span>

                    <span
                      className={
                        warning
                          ? "font-medium text-red-600"
                          : "text-slate-500"
                      }
                    >
                      {limit.used} / {maximum}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-full rounded-full ${
                        warning ? "bg-red-500" : "bg-brand"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="mt-1 text-right text-[11px] text-slate-400">
                    {Math.round(percentage)}% used
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800">
          <p className="text-xs text-slate-500">
            Changes are currently for UI preview only.
          </p>

          <button
            type="button"
            className="btn btn-primary w-full sm:w-auto"
            onClick={() => alert("Usage limits saved.")}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}