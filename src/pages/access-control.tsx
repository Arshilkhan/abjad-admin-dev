import { useEffect, useState } from "react";
import { Building2, Check, ShieldCheck } from "lucide-react";
import { organizationService } from "../services/organizationService";
import type { Organization } from "../types";

const panels = [
    "Dashboard",
    "Invoices",
    "Proforma Invoices",
    "Quotations",
    "Challans",
    "Purchases",
    "Cancelled Invoices",
    "Rejected Items",
    "Customers",
    "Products",
    "Inventory",
    "Customer Credits",
    "Payments",
    "Reports",
];

const initialAccess: Record<string, boolean> = Object.fromEntries(
    panels.map((panel) => [panel, true])
);

export default function AccessControl() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrg, setSelectedOrg] = useState("");
    const [access, setAccess] =
        useState<Record<string, boolean>>(initialAccess);

    useEffect(() => {
        organizationService.getAll().then((data) => {
            setOrganizations(data);

            if (data.length > 0) {
                setSelectedOrg(data[0].id);
            }
        });
    }, []);

    const togglePanel = (panel: string) => {
        setAccess((current) => ({
            ...current,
            [panel]: !current[panel],
        }));
    };

    const selectedOrganization = organizations.find(
        (organization) => organization.id === selectedOrg
    );

    const enabledCount = panels.filter((panel) => access[panel]).length;

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-soft text-brand">
                        <ShieldCheck size={20} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold">Access Control</h1>
                        <p className="text-sm text-slate-500">
                            Control which ERP panels are available to each organization.
                        </p>
                    </div>
                </div>
            </div>

            {/* Organization selector */}
            <div className="card p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <label
                            htmlFor="organization"
                            className="label"
                        >
                            Organization
                        </label>

                        <div className="relative">
                            <Building2
                                size={16}
                                className="pointer-events-none absolute left-3 top-3 text-slate-400"
                            />

                            <select
                                id="organization"
                                value={selectedOrg}
                                onChange={(event) => setSelectedOrg(event.target.value)}
                                className="input w-full pl-9"
                            >
                                {organizations.map((organization) => (
                                    <option
                                        key={organization.id}
                                        value={organization.id}
                                    >
                                        {organization.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="w-full rounded-lg bg-slate-50 px-4 py-2.5 sm:w-auto dark:bg-slate-800">
                        <div className="text-xs text-slate-500">
                            Panels enabled
                        </div>

                        <div className="text-sm font-semibold">
                            {enabledCount} / {panels.length}
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

            {/* Panel access */}
            <div className="card overflow-hidden">
                <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                    <h2 className="font-semibold">ERP Panel Access</h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Enable or disable individual ERP panels for this organization.
                    </p>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {panels.map((panel) => {
                        const enabled = access[panel];

                        return (
                            <div
                                key={panel}
                                className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5"
                            >
                                <div className="min-w-0 pr-2">
                                    <div className="text-sm font-medium">
                                        {panel}
                                    </div>

                                    <div className="mt-0.5 text-xs text-slate-500">
                                        {enabled
                                            ? "Available to this organization"
                                            : "Not available to this organization"}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={enabled}
                                    aria-label={`${enabled ? "Disable" : "Enable"} ${panel}`}
                                    onClick={() => togglePanel(panel)}
                                    className={`relative h-6 w-11 rounded-full transition ${enabled
                                        ? "bg-brand"
                                        : "bg-slate-300 dark:bg-slate-700"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${enabled ? "left-6" : "left-1"
                                            }`}
                                    />

                                    {enabled && (
                                        <Check
                                            size={10}
                                            className="absolute left-1.5 top-1.5 text-white"
                                        />
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Save */}
                <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800">                    <p className="text-xs text-slate-500">
                    Changes are currently for UI preview only.
                </p>

                    <button
                        type="button"
                        className="btn btn-primary w-full sm:w-auto"
                        onClick={() => alert("Access settings saved.")}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}