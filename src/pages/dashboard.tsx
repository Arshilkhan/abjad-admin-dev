import { Area, AreaChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";
const stats = [["Total Organizations","27","+2 this month"],["Active Organizations","24","+1"],["Active Users","143","+9"],["MRR","₹1,84,500","+6.2%"],["Trial Organizations","3","-1"],["Needs Attention","2","Review"]];
const m = ["Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"];
const growth = m.map((x,i) => ({ m:x, orgs:12+i+Math.floor(i/3) }));
const rev = m.map((x,i) => ({ m:x, mrr:82000+i*9300 }));
const plans = [["Starter",9,"#94a3b8"],["Business",11,"#2f3e9e"],["Enterprise",4,"#0f172a"],["Trial",3,"#d4a017"]] as const;
export default function Dashboard() {
  return (<div className="space-y-6">
    <div><h1 className="text-2xl font-semibold">Good morning, Arshil</h1><p className="text-sm text-slate-500">Here's what's happening across the ABJAD platform.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">{stats.map(([l,v,t]) => (
      <div key={l} className="card p-4"><div className="text-xs text-slate-500">{l}</div><div className="mt-1 text-2xl font-semibold">{v}</div>
      <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600"><TrendingUp size={12}/>{t}</div></div>))}</div>
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="card p-4"><h2 className="mb-3 text-sm font-medium">Organization growth</h2><div className="h-56"><ResponsiveContainer><LineChart data={growth}><XAxis dataKey="m" fontSize={11}/><YAxis fontSize={11}/><Tooltip/><Line dataKey="orgs" stroke="#2f3e9e" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div></div>
      <div className="card p-4"><h2 className="mb-3 text-sm font-medium">Monthly recurring revenue</h2><div className="h-56"><ResponsiveContainer><AreaChart data={rev}><XAxis dataKey="m" fontSize={11}/><YAxis fontSize={11}/><Tooltip/><Area dataKey="mrr" stroke="#2f3e9e" fill="#2f3e9e33"/></AreaChart></ResponsiveContainer></div></div>
      <div className="card p-4"><h2 className="mb-3 text-sm font-medium">Plan distribution</h2><div className="h-56"><ResponsiveContainer><PieChart><Pie data={plans.map(p => ({name:p[0],value:p[1]}))} dataKey="value" innerRadius={55} outerRadius={80}>{plans.map(p => <Cell key={p[0]} fill={p[2]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div></div>
    </div></div>);
}
