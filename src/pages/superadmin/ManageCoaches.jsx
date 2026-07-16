import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import api from "../../services/api";

export default function ManageCoaches() {
  const [rows, setRows] = useState([]); const [q, setQ] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/admin/coaches").then((r) => setRows(r.coaches || [])).finally(() => setLoading(false)); }, []);
  const filtered = rows.filter((r) => `${r.name} ${r.email}`.toLowerCase().includes(q.toLowerCase()));
  return <AdminTable title="Coaches" subtitle="All platform coaches" rows={filtered} loading={loading} q={q} setQ={setQ} columns={["Name", "Email", "Status", "Courses", "Students", "Revenue"]} render={(r) => [r.name, r.email, r.status, r.stats?.courses ?? 0, r.stats?.students ?? 0, `?${r.stats?.revenue ?? 0}`]} />;
}

function AdminTable({ title, subtitle, rows, loading, q, setQ, columns, render }) { return <div className="space-y-6"><div><h2 className="text-2xl font-bold text-slate-900">{title}</h2><p className="text-sm text-slate-500 mt-1">{subtitle}</p></div><div className="bg-white rounded-2xl shadow-sm p-4"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${title.toLowerCase()}...`} className="w-full rounded-lg border px-9 py-2 text-sm" /></div></div><div className="bg-white rounded-2xl shadow-sm overflow-hidden"><table className="w-full text-sm"><thead className="bg-slate-50"><tr>{columns.map((c) => <th key={c} className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-500">{c}</th>)}</tr></thead><tbody className="divide-y">{loading ? <tr><td colSpan={columns.length} className="py-10 text-center text-slate-400">Loading...</td></tr> : rows.length === 0 ? <tr><td colSpan={columns.length} className="py-10 text-center text-slate-400"><Users className="mx-auto mb-2" />No data found</td></tr> : rows.map((row) => <tr key={row.id} className="hover:bg-slate-50">{render(row).map((v, i) => <td key={i} className="px-5 py-3 text-slate-700">{v}</td>)}</tr>)}</tbody></table></div></div>; }