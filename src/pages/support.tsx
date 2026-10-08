import { useMemo, useState } from "react";
import { LifeBuoy, Search } from "lucide-react";

const tickets = [
  {
    id: "SUP-1042",
    organization: "XYZ Manufacturing",
    subject: "Unable to generate invoice PDF",
    category: "Technical",
    priority: "High",
    status: "Open",
    updated: "10 min ago",
    assigned: "Arshil Khan",
  },
  {
    id: "SUP-1041",
    organization: "Shree Industries",
    subject: "Login issue",
    category: "Account",
    priority: "Medium",
    status: "Open",
    updated: "42 min ago",
    assigned: "Arshil Khan",
  },
  {
    id: "SUP-1040",
    organization: "ABJAD Engineering Works",
    subject: "Request to enable Google Drive",
    category: "Feature",
    priority: "Low",
    status: "Pending",
    updated: "2 hrs ago",
    assigned: "Arshil Khan",
  },
  {
    id: "SUP-1039",
    organization: "Global Engineering",
    subject: "Inventory data mismatch",
    category: "Technical",
    priority: "High",
    status: "In Progress",
    updated: "4 hrs ago",
    assigned: "Arshil Khan",
  },
  {
    id: "SUP-1038",
    organization: "Kaveri Castings",
    subject: "Organization cancellation request",
    category: "Account",
    priority: "Medium",
    status: "Resolved",
    updated: "Yesterday",
    assigned: "Arshil Khan",
  },
];

const statusTone: Record<string, string> = {
  Open: "bg-blue-100 text-blue-800",
  Pending: "bg-amber-100 text-amber-800",
  "In Progress": "bg-violet-100 text-violet-800",
  Resolved: "bg-emerald-100 text-emerald-800",
};

const priorityTone: Record<string, string> = {
  High: "text-red-600",
  Medium: "text-amber-600",
  Low: "text-slate-500",
};

export default function Support() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const search = query.toLowerCase();

      const matchesQuery =
        ticket.id.toLowerCase().includes(search) ||
        ticket.organization.toLowerCase().includes(search) ||
        ticket.subject.toLowerCase().includes(search);

      const matchesStatus =
        status === "All" || ticket.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const openCount = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const pendingCount = tickets.filter(
    (ticket) => ticket.status === "Pending"
  ).length;

  const inProgressCount = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
          <LifeBuoy size={20} />
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Support</h1>
          <p className="text-sm text-slate-500">
            Manage support requests from organizations using ABJAD.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card p-4">
          <div className="text-xs text-slate-500">Open</div>
          <div className="mt-1 text-2xl font-semibold">{openCount}</div>
        </div>

        <div className="card p-4">
          <div className="text-xs text-slate-500">Pending</div>
          <div className="mt-1 text-2xl font-semibold">
            {pendingCount}
          </div>
        </div>

        <div className="card p-4">
          <div className="text-xs text-slate-500">In Progress</div>
          <div className="mt-1 text-2xl font-semibold">
            {inProgressCount}
          </div>
        </div>

        <div className="card p-4">
          <div className="text-xs text-slate-500">Resolved</div>
          <div className="mt-1 text-2xl font-semibold">
            {resolvedCount}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-3">
        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              className="input w-full pl-9"
              placeholder="Search tickets..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <select
            className="input w-full sm:w-auto"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Ticket status"
          >
            <option>All</option>
            <option>Open</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="card hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800">
            <tr>
              <th className="p-3">Ticket</th>
              <th className="p-3">Organization</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Category</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Updated</th>
              <th className="p-3">Assigned To</th>
            </tr>
          </thead>

          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="p-8 text-center text-slate-500"
                >
                  No support tickets match your search.
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                >
                  <td className="p-3 font-medium">{ticket.id}</td>

                  <td className="p-3">
                    {ticket.organization}
                  </td>

                  <td className="min-w-64 p-3">
                    {ticket.subject}
                  </td>

                  <td className="p-3 text-slate-500">
                    {ticket.category}
                  </td>

                  <td
                    className={`p-3 font-medium ${
                      priorityTone[ticket.priority]
                    }`}
                  >
                    {ticket.priority}
                  </td>

                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        statusTone[ticket.status]
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap p-3 text-xs text-slate-500">
                    {ticket.updated}
                  </td>

                  <td className="p-3">{ticket.assigned}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filteredTickets.length === 0 ? (
          <div className="card p-8 text-center text-sm text-slate-500">
            No support tickets match your search.
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">
                    {ticket.id}
                  </p>

                  <h2 className="mt-1 font-semibold">
                    {ticket.subject}
                  </h2>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-xs ${
                    statusTone[ticket.status]
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-500">
                    Organization
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {ticket.organization}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Category
                    </p>

                    <p className="mt-1 text-sm">
                      {ticket.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Priority
                    </p>

                    <p
                      className={`mt-1 text-sm font-medium ${
                        priorityTone[ticket.priority]
                      }`}
                    >
                      {ticket.priority}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Updated
                    </p>

                    <p className="mt-1 text-sm">
                      {ticket.updated}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Assigned To
                    </p>

                    <p className="mt-1 text-sm">
                      {ticket.assigned}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}