import { useState } from "react";
import {
  DollarSign, TrendingUp, Users, Download,
  ArrowUpRight, ArrowDownRight, Filter
} from "lucide-react";

const transactions = [
  { id: 1, student: "Rahul Sharma",  course: "React Masterclass", amount: "₹999",  date: "28 May 2025", status: "Paid" },
  { id: 2, student: "Priya Singh",   course: "Node.js Basics",    amount: "₹799",  date: "27 May 2025", status: "Paid" },
  { id: 3, student: "Amit Kumar",    course: "React Masterclass", amount: "₹999",  date: "26 May 2025", status: "Paid" },
  { id: 4, student: "Neha Gupta",    course: "CSS Advanced",      amount: "₹599",  date: "25 May 2025", status: "Pending" },
  { id: 5, student: "Vikram Patel",  course: "Node.js Basics",    amount: "₹799",  date: "24 May 2025", status: "Paid" },
  { id: 6, student: "Sunita Mehra",  course: "React Masterclass", amount: "₹999",  date: "23 May 2025", status: "Refunded" },
];

const months = ["May 2025","Apr 2025","Mar 2025","Feb 2025"];

export default function CoachEarnings() {
  const [selectedMonth, setSelectedMonth] = useState("May 2025");
  const [statusFilter,  setStatusFilter]  = useState("All");

  const filtered = transactions.filter((t) =>
    statusFilter === "All" || t.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Earnings</h2>
          <p className="text-sm text-gray-500 mt-1">Track your revenue and transactions</p>
        </div>
        <button className="flex items-center gap-2 border px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Earnings",   value: "₹71,200", sub: "+12% this month", icon: DollarSign, color: "text-indigo-600", bg: "bg-indigo-100", up: true },
          { label: "This Month",       value: "₹12,400", sub: "+5% vs last month", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100", up: true },
          { label: "Total Paid Users", value: "89",      sub: "3 pending", icon: Users, color: "text-yellow-600", bg: "bg-yellow-100", up: false },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`${s.bg} p-2.5 rounded-xl`}>
                <s.icon size={20} className={s.color} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${s.up ? "text-green-500" : "text-red-400"}`}>
                {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {s.sub}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart Mock */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">Monthly Revenue</h3>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {months.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex items-end gap-2 h-40">
          {[30, 55, 45, 70, 60, 85, 50, 75, 90, 65, 80, 95].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-indigo-400 rounded-t hover:bg-indigo-600 transition-colors cursor-pointer"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
          {["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12"].map((w) => (
            <span key={w} className="flex-1 text-center">{w}</span>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold text-gray-700">Transaction History</h3>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {["All","Paid","Pending","Refunded"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["#","Student","Course","Amount","Date","Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-400">#{t.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{t.student}</td>
                  <td className="px-5 py-3">
                    <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full">{t.course}</span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-800">{t.amount}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{t.date}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      t.status === "Paid"     ? "bg-green-100 text-green-600"  :
                      t.status === "Pending"  ? "bg-yellow-100 text-yellow-600" :
                                               "bg-red-100 text-red-500"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}