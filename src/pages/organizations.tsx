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
  const [status, setStatus] = useState<"All" | OrgStatus>("All");
  const [plan, setPlan] = useState<"All" | PlanName>("All");
  const [asc, setAsc] = useState(true);
  const [del, setDel] = useState<Organization | null>(null);

  const load = () => organizationService.getAll().then(setRows);

  useEffect(() => {
    load();
  }, []);

  const view = useMemo(
    () =>
      (rows ?? [])
        .filter(
          (o) =>
            o.name.toLowerCase().includes(q.toLowerCase()) &&
            (status === "All" || o.status === status) &&
            (plan === "All" || o.plan === plan),
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
              setStatus(e.target.value as "Status" | OrgStatus)
            }
          >
            {["Status", "Active", "Trial", "Suspended", "Cancelled"].map(
              (s) => (
                <option key={s}>{s}</option>
              ),
            )}
          </select>

          <select
            className="input w-full sm:w-auto"
            aria-label="Plan"
            value={plan}
            onChange={(e) =>
              setPlan(e.target.value as "Plan" | PlanName)
            }
          >
            {["Plan", "Trial", "Starter", "Business", "Enterprise"].map(
              (s) => (
                <option key={s}>{s}</option>
              ),
            )}
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
                    <button
                      className="btn"
                      onClick={() =>
                        organizationService
                          .suspend(o.id)
                          .then(load)
                      }
                    >
                      Suspend
                    </button>

                    <button
                      className="btn"
                      onClick={() => setDel(o)}
                    >
                      Delete
                    </button>
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
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <button
                    className="btn w-full"
                    onClick={() =>
                      organizationService
                        .suspend(o.id)
                        .then(load)
                    }
                  >
                    Suspend
                  </button>

                  <button
                    className="btn w-full"
                    onClick={() => setDel(o)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Delete confirmation */}
      {del && (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
        >
          <div className="card w-full max-w-sm p-5">
            <h2 className="font-semibold">
              Delete {del.name}?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              This is a UI preview. Nothing will be deleted.
            </p>

            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                className="btn"
                onClick={() => setDel(null)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={() => setDel(null)}
              >
                Delete organization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}