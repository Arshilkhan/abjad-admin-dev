import { useState } from "react";
import { ClipboardList, Search } from "lucide-react";

const logs = [
    {
        id: 1,
        user: "Arshil Khan",
        action: "Organization Created",
        organization: "Shree Industries",
        details: "Created a new organization",
        time: "08 Oct 2026, 10:42 AM",
        type: "Organization",
    },
    {
        id: 2,
        user: "Arshil Khan",
        action: "Access Control Updated",
        organization: "ABJAD Engineering Works",
        details: "Enabled Inventory panel",
        time: "08 Oct 2026, 10:18 AM",
        type: "Access Control",
    },
    {
        id: 3,
        user: "Arshil Khan",
        action: "Feature Enabled",
        organization: "XYZ Manufacturing",
        details: "Enabled AI Auto-fill",
        time: "07 Oct 2026, 04:35 PM",
        type: "Feature",
    },
    {
        id: 4,
        user: "Arshil Khan",
        action: "Usage Limit Updated",
        organization: "Apex Components",
        details: "Invoice limit changed from 500 to 1000",
        time: "07 Oct 2026, 03:12 PM",
        type: "Usage",
    },
    {
        id: 5,
        user: "Arshil Khan",
        action: "Organization Suspended",
        organization: "Apex Components",
        details: "Organization status changed to Suspended",
        time: "06 Oct 2026, 01:47 PM",
        type: "Organization",
    },
    {
        id: 6,
        user: "Arshil Khan",
        action: "Subscription Updated",
        organization: "XYZ Manufacturing",
        details: "Plan changed to Enterprise",
        time: "05 Oct 2026, 11:26 AM",
        type: "Subscription",
    },
];

const typeTone: Record<string, string> = {
    Organization: "bg-blue-100 text-blue-800",
    "Access Control": "bg-violet-100 text-violet-800",
    Feature: "bg-emerald-100 text-emerald-800",
    Usage: "bg-amber-100 text-amber-800",
    Subscription: "bg-slate-200 text-slate-700",
};

export default function AuditLogs() {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("All");

    const filteredLogs = logs.filter((log) => {
        const search = query.toLowerCase();

        const matchesQuery =
            log.user.toLowerCase().includes(search) ||
            log.organization.toLowerCase().includes(search) ||
            log.action.toLowerCase().includes(search) ||
            log.details.toLowerCase().includes(search);

        const matchesType =
            type === "All" || log.type === type;

        return matchesQuery && matchesType;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                    <ClipboardList size={20} />
                </div>

                <div className="min-w-0">
                    <h1 className="text-2xl font-semibold">
                        Audit Logs
                    </h1>

                    <p className="text-sm text-slate-500">
                        Review important administrative activity across the ABJAD platform.
                    </p>
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
                            placeholder="Search activity..."
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </div>

                    <select
                        className="input w-full sm:w-auto"
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                        aria-label="Activity type"
                    >
                        <option>All</option>
                        <option>Organization</option>
                        <option>Access Control</option>
                        <option>Feature</option>
                        <option>Usage</option>
                        <option>Subscription</option>
                    </select>
                </div>
            </div>

            {/* Desktop table */}
            <div className="card hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800">
                        <tr>
                            <th className="p-3">Date & Time</th>
                            <th className="p-3">Administrator</th>
                            <th className="p-3">Action</th>
                            <th className="p-3">Organization</th>
                            <th className="p-3">Details</th>
                            <th className="p-3">Type</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredLogs.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-8 text-center text-slate-500"
                                >
                                    No audit logs match your search.
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                                >
                                    <td className="whitespace-nowrap p-3 text-xs text-slate-500">
                                        {log.time}
                                    </td>

                                    <td className="p-3 font-medium">
                                        {log.user}
                                    </td>

                                    <td className="p-3">
                                        {log.action}
                                    </td>

                                    <td className="p-3">
                                        {log.organization}
                                    </td>

                                    <td className="max-w-xs p-3 text-slate-500">
                                        {log.details}
                                    </td>

                                    <td className="p-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs ${typeTone[log.type]
                                                }`}
                                        >
                                            {log.type}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
                {filteredLogs.length === 0 ? (
                    <div className="card p-8 text-center text-sm text-slate-500">
                        No audit logs match your search.
                    </div>
                ) : (
                    filteredLogs.map((log) => (
                        <div key={log.id} className="card p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h2 className="font-semibold">
                                        {log.action}
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {log.time}
                                    </p>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2 py-1 text-xs ${typeTone[log.type]
                                        }`}
                                >
                                    {log.type}
                                </span>
                            </div>

                            <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Administrator
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {log.user}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Organization
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {log.organization}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Details
                                    </p>

                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                        {log.details}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}