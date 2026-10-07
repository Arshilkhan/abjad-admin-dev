import { useEffect, useMemo, useState } from "react";
import { organizationService } from "../services/organizationService";
import type { Organization, OrgStatus, PlanName } from "../types";
const tone: Record<OrgStatus,string> = { Active:"bg-emerald-100 text-emerald-800", Trial:"bg-amber-100 text-amber-800", Suspended:"bg-red-100 text-red-800", Cancelled:"bg-slate-200 text-slate-700" };
export default function Organizations() {
  const [rows, setRows] = useState<Organization[] | null>(null);
  const [q, setQ] = useState(""); const [status, setStatus] = useState<"All"|OrgStatus>("All"); const [plan, setPlan] = useState<"All"|PlanName>("All");
  const [asc, setAsc] = useState(true); const [del, setDel] = useState<Organization | null>(null);
  const load = () => organizationService.getAll().then(setRows);
  useEffect(() => { load(); }, []);
  const view = useMemo(() => (rows ?? []).filter(o => o.name.toLowerCase().includes(q.toLowerCase()) && (status==="All"||o.status===status) && (plan==="All"||o.plan===plan))
    .sort((a,b) => asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)), [rows,q,status,plan,asc]);
  return (<div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold">Organizations</h1><p className="text-sm text-slate-500">Manage all organizations using ABJAD ERP.</p></div>
      <button className="btn btn-primary">+ Create Organization</button></div>
    <div className="flex flex-wrap gap-2">
      <input className="input w-64" placeholder="Search organizations" value={q} onChange={e => setQ(e.target.value)}/>
      <select className="input" aria-label="Status" value={status} onChange={e => setStatus(e.target.value as "All"|OrgStatus)}>{["All","Active","Trial","Suspended","Cancelled"].map(s => <option key={s}>{s}</option>)}</select>
      <select className="input" aria-label="Plan" value={plan} onChange={e => setPlan(e.target.value as "All"|PlanName)}>{["All","Trial","Starter","Business","Enterprise"].map(s => <option key={s}>{s}</option>)}</select></div>
    <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800"><tr>
      <th className="p-3"><button onClick={() => setAsc(!asc)}>Organization {asc?"↑":"↓"}</button></th><th>Status</th><th>Plan</th><th>Users</th><th>Created</th><th>Last active</th><th>Usage</th><th/></tr></thead>
      <tbody>{rows === null ? <tr><td colSpan={8} className="p-6 text-center text-slate-500">Loading…</td></tr> :
       view.length === 0 ? <tr><td colSpan={8} className="p-8 text-center text-slate-500">No organizations match these filters. Clear the search or change the status.</td></tr> :
       view.map(o => (<tr key={o.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
        <td className="p-3 font-medium">{o.name}</td><td><span className={`rounded-full px-2 py-0.5 text-xs ${tone[o.status]}`}>{o.status}</span></td><td>{o.plan}</td><td>{o.users}</td><td>{o.created}</td><td>{o.lastActive}</td>
        <td className="w-32"><div className="h-1.5 rounded bg-slate-200 dark:bg-slate-700"><div className={`h-1.5 rounded ${o.usage>85?"bg-red-500":"bg-brand"}`} style={{width:`${o.usage}%`}}/></div></td>
        <td className="whitespace-nowrap pr-3 text-right"><button className="btn" onClick={() => organizationService.suspend(o.id).then(load)}>Suspend</button> <button className="btn" onClick={() => setDel(o)}>Delete</button></td></tr>))}</tbody></table></div>
    {del && <div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-center bg-black/40"><div className="card w-full max-w-sm p-5">
      <h2 className="font-semibold">Delete {del.name}?</h2><p className="mt-2 text-sm text-slate-500">This is a UI preview. Nothing will be deleted.</p>
      <div className="mt-4 flex justify-end gap-2"><button className="btn" onClick={() => setDel(null)}>Cancel</button><button className="btn btn-primary" onClick={() => setDel(null)}>Delete organization</button></div></div></div>}
  </div>);
}
