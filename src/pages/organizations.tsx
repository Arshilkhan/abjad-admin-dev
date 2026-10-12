import { useEffect, useMemo, useState } from "react";
import { organizationService } from "../services/organizationService";
import { useNavigate } from "react-router-dom";
import type { Organization, OrgStatus, PlanName } from "../types";

const tone: Record<OrgStatus, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Trial: "bg-amber-100 text-amber-800",
  Suspended: "bg-red-100 text-red-800",
  Cancelled: "bg-slate-200 text-slate-700",
};

export default function Organizations() {
  const navigate = useNavigate();

  const [rows, setRows] = useState<Organization[] | null>(null);
  const [q, setQ] = useState("");
  const [asc, setAsc] = useState(true);
  const [status, setStatus] = useState<OrgStatus | "All" | "">("");
  const [plan, setPlan] = useState<PlanName | "All" | "">("");
  const [del, setDel] = useState<Organization | null>(null);
  const [actionError, setActionError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const load = async () => {
    try {
      const organizations = await organizationService.getAll();
      setRows(organizations);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Could not load organizations.",
      );
    }
  };

  type OrganizationAction =
    | "edit"
    | "suspend"
    | "reactivate"
    | "cancel";

  const handleAction = async (
    organization: Organization,
    action: OrganizationAction,
  ) => {
    setActionError("");

    if (action === "edit") {
      navigate(`/organizations/${organization.id}/edit`);
      return;
    }

    if (action === "cancel") {
      setDel(organization);
      return;
    }

    setActionLoadingId(organization.id);

    try {
      if (action === "suspend") {
        await organizationService.suspend(organization.id);
      } else {
        await organizationService.reactivate(organization.id);
      }

      await load();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Could not update organization status.",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const confirmCancellation = async () => {
    if (!del) return;

    setIsCancelling(true);
    setActionError("");

    try {
      await organizationService.cancel(del.id);
      setDel(null);
      await load();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Could not cancel organization.",
      );
    } finally {
      setIsCancelling(false);
    }
  };


  useEffect(() => {
    load();
  }, []);

  const view = useMemo(
    () =>
      (rows ?? [])
        .filter(
          (o) =>
            o.name.toLowerCase().includes(q.toLowerCase()) &&
            (status === "" || status === "All" || o.status === status) &&
            (plan === "" || plan === "All" || o.plan === plan),
        )
        .sort((a, b) =>
          asc
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name),
        ),
    [rows, q, status, plan, asc],
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Organizations</h1>
          <p className="text-sm text-slate-500">
            Manage all organizations using ABJAD ERP.
          </p>
        </div>

        <button
          className="btn btn-primary w-full sm:w-auto"
          onClick={() => navigate("/organizations/new")}
        >
          + Create Organization
        </button>
      </div>
      {actionError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {actionError}
        </div>
      )}
      {/* Filters */}
      <div className="card p-3">
        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
          <input
            className="input w-full sm:w-64"
            placeholder="Search organizations"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="input w-full sm:w-auto"
            aria-label="Status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "All" | "")
            }
          >
            <option value="" disabled>
              Status
            </option>
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Trial">Trial</option>
            <option value="Suspended">Suspended</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            className="input w-full sm:w-auto"
            aria-label="Plan"
            value={plan}
            onChange={(e) =>
              setPlan(e.target.value as "All" | "")
            }
          >
            <option value="" disabled>
              Plan
            </option>
            <option value="All">All</option>
            <option value="Trial">Trial</option>
            <option value="Starter">Starter</option>
            <option value="Business">Business</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="card hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800">
            <tr>
              <th className="p-3">
                <button onClick={() => setAsc(!asc)}>
                  Organization {asc ? "↑" : "↓"}
                </button>
              </th>
              <th>Status</th>
              <th>Plan</th>
              <th>Users</th>
              <th>Created</th>
              <th>Last active</th>
              <th>Usage</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {rows === null ? (
              <tr>
                <td
                  colSpan={8}
                  className="p-6 text-center text-slate-500"
                >
                  Loading…
                </td>
              </tr>
            ) : view.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="p-8 text-center text-slate-500"
                >
                  No organizations match these filters. Clear the
                  search or change the status.
                </td>
              </tr>
            ) : (
              view.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                >
                  <td className="p-3 font-medium">{o.name}</td>

                  <td>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${tone[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td>{o.plan}</td>

                  <td>{o.users}</td>

                  <td>{o.created}</td>

                  <td>{o.lastActive}</td>

                  <td className="w-32">
                    <div className="h-1.5 rounded bg-slate-200 dark:bg-slate-700">
                      <div
                        className={`h-1.5 rounded ${o.usage > 85
                          ? "bg-red-500"
                          : "bg-brand"
                          }`}
                        style={{ width: `${o.usage}%` }}
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap pr-3 text-right">
                    <select
                      key={`${o.id}-${actionLoadingId === o.id ? "loading" : "ready"}`}
                      className="input w-36"
                      aria-label={`Actions for ${o.name}`}
                      defaultValue=""
                      disabled={actionLoadingId === o.id}
                      onChange={(event) => {
                        const action = event.target.value as OrganizationAction;
                        event.currentTarget.value = "";

                        if (action) {
                          void handleAction(o, action);
                        }
                      }}
                    >
                      <option value="" disabled>
                        {actionLoadingId === o.id ? "Please wait…" : "Actions"}
                      </option>
                      <option value="edit">Edit</option>

                      {o.status === "Active" || o.status === "Trial" ? (
                        <option value="suspend">Suspend</option>
                      ) : null}

                      {o.status === "Suspended" ? (
                        <option value="reactivate">Reactivate</option>
                      ) : null}

                      {o.status !== "Cancelled" ? (
                        <option value="cancel">Cancel organization</option>
                      ) : null}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {rows === null ? (
          <div className="card p-6 text-center text-sm text-slate-500">
            Loading…
          </div>
        ) : view.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate-500">
            No organizations match these filters.
            <div className="mt-1">
              Clear the search or change the status.
            </div>
          </div>
        ) : (
          <>
            {/* Mobile sort */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                {view.length} organization
                {view.length === 1 ? "" : "s"}
              </p>

              <button
                className="btn"
                onClick={() => setAsc(!asc)}
              >
                Name {asc ? "↑" : "↓"}
              </button>
            </div>

            {view.map((o) => (
              <div key={o.id} className="card p-4">
                {/* Organization heading */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">
                      {o.name}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {o.plan}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-xs ${tone[o.status]}`}
                  >
                    {o.status}
                  </span>
                </div>

                {/* Organization details */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">
                      Users
                    </p>
                    <p className="mt-0.5 font-medium">
                      {o.users}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Last active
                    </p>
                    <p className="mt-0.5 font-medium">
                      {o.lastActive}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Created
                    </p>
                    <p className="mt-0.5 font-medium">
                      {o.created}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Usage
                    </p>
                    <p className="mt-0.5 font-medium">
                      {o.usage}%
                    </p>
                  </div>
                </div>

                {/* Usage */}
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                    <span>Usage</span>
                    <span>{o.usage}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-2 rounded-full ${o.usage > 85
                        ? "bg-red-500"
                        : "bg-brand"
                        }`}
                      style={{ width: `${o.usage}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <select
                    key={`${o.id}-${actionLoadingId === o.id ? "loading" : "ready"}`}
                    className="input w-full"
                    aria-label={`Actions for ${o.name}`}
                    defaultValue=""
                    disabled={actionLoadingId === o.id}
                    onChange={(event) => {
                      const action = event.target.value as OrganizationAction;
                      event.currentTarget.value = "";

                      if (action) {
                        void handleAction(o, action);
                      }
                    }}
                  >
                    <option value="" disabled>
                      {actionLoadingId === o.id ? "Please wait…" : "Choose an action"}
                    </option>
                    <option value="edit">Edit</option>

                    {o.status === "Active" || o.status === "Trial" ? (
                      <option value="suspend">Suspend</option>
                    ) : null}

                    {o.status === "Suspended" ? (
                      <option value="reactivate">Reactivate</option>
                    ) : null}

                    {o.status !== "Cancelled" ? (
                      <option value="cancel">Cancel organization</option>
                    ) : null}
                  </select>
                </div>

              </div>
            ))}
          </>
        )}
      </div>

      {/* Organization cancellation confirmation */}
      {del && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-organization-title"
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
        >
          <div className="card w-full max-w-md p-5">
            <h2
              id="cancel-organization-title"
              className="font-semibold"
            >
              Cancel {del.name}?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              This will mark the organization as Cancelled. Its records
              will be retained, but organization members should no longer
              be able to access the ERP.
            </p>

            {actionError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {actionError}
              </p>
            )}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="btn"
                disabled={isCancelling}
                onClick={() => {
                  setDel(null);
                  setActionError("");
                }}
              >
                Keep organization
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={isCancelling}
                onClick={() => void confirmCancellation()}
              >
                {isCancelling ? "Cancelling…" : "Confirm cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}