import { useState } from "react";
import {
  Plus, Search, Filter, ClipboardList, Eye,
  Edit2, Trash2, CheckCircle, Clock, XCircle
} from "lucide-react";

const mockAssignments = [
  { id: 1, title: "Build a Todo App",        course: "React Masterclass", dueDate: "05 Jun 2025", submissions: 12, total: 45, status: "Active" },
  { id: 2, title: "REST API with Express",   course: "Node.js Basics",    dueDate: "08 Jun 2025", submissions: 8,  total: 32, status: "Active" },
  { id: 3, title: "Flexbox Layout Challenge",course: "CSS Advanced",      dueDate: "01 Jun 2025", submissions: 18, total: 18, status: "Closed" },
  { id: 4, title: "React Hooks Assignment",  course: "React Masterclass", dueDate: "12 Jun 2025", submissions: 3,  total: 45, status: "Active" },
  { id: 5, title: "Database Schema Design",  course: "Node.js Basics",    dueDate: "15 Jun 2025", submissions: 0,  total: 32, status: "Draft"  },
];

const submissions = [
  { id: 1, student: "Rahul Sharma", assignment: "Build a Todo App", submittedOn: "03 Jun 2025", grade: "A",  status: "Graded"   },
  { id: 2, student: "Priya Singh",  assignment: "Build a Todo App", submittedOn: "04 Jun 2025", grade: "-",  status: "Pending"  },
  { id: 3, student: "Amit Kumar",   assignment: "Build a Todo App", submittedOn: "02 Jun 2025", grade: "B+", status: "Graded"   },
  { id: 4, student: "Neha Gupta",   assignment: "Build a Todo App", submittedOn: "-",           grade: "-",  status: "Missing"  },
];

const courseOptions = ["All Courses","React Masterclass","Node.js Basics","CSS Advanced"];

export default function ManageAssignments() {
  const [tab,          setTab]          = useState("assignments");
  const [search,       setSearch]       = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [showModal,    setShowModal]    = useState(false);

  const filtered = mockAssignments.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === "All Courses" || a.course === courseFilter;
    return matchSearch && matchCourse;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Assignments</h2>
          <p className="text-sm text-gray-500 mt-1">Create and review student assignments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> New Assignment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {["assignments", "submissions"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Search assignments..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {courseOptions.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Assignments Tab */}
      {tab === "assignments" && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Assignment","Course","Due Date","Submissions","Status","Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <ClipboardList size={16} className="text-indigo-400 flex-shrink-0" />
                      <span className="font-medium text-gray-800">{a.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full">{a.course}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{a.dueDate}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-indigo-500"
                          style={{ width: `${(a.submissions / a.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{a.submissions}/{a.total}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      a.status === "Active" ? "bg-green-100 text-green-600" :
                      a.status === "Closed" ? "bg-gray-100 text-gray-500"  :
                                              "bg-yellow-100 text-yellow-600"
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-indigo-50 rounded-lg" title="View"><Eye size={14} className="text-indigo-400" /></button>
                      <button className="p-1.5 hover:bg-yellow-50 rounded-lg" title="Edit"><Edit2 size={14} className="text-yellow-500" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} className="text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submissions Tab */}
      {tab === "submissions" && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Student","Assignment","Submitted On","Grade","Status","Action"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {s.student[0]}
                      </div>
                      <span className="font-medium text-gray-800">{s.student}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600 text-xs">{s.assignment}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{s.submittedOn}</td>
                  <td className="px-5 py-3">
                    <span className={`font-bold ${s.grade !== "-" ? "text-green-600" : "text-gray-400"}`}>
                      {s.grade}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${
                      s.status === "Graded"  ? "bg-green-100 text-green-600"  :
                      s.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                                              "bg-red-100 text-red-500"
                    }`}>
                      {s.status === "Graded"  && <CheckCircle size={11} />}
                      {s.status === "Pending" && <Clock size={11} />}
                      {s.status === "Missing" && <XCircle size={11} />}
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {s.status === "Pending" ? (
                      <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition">
                        Grade Now
                      </button>
                    ) : (
                      <button className="text-xs border px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition">
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showModal && <AssignmentModal onClose={() => setShowModal(false)} courseOptions={courseOptions.slice(1)} />}
    </div>
  );
}

/* ─── Assignment Modal ───────────────────────── */
function AssignmentModal({ onClose, courseOptions }) {
  const [form, setForm] = useState({ title: "", course: courseOptions[0], dueDate: "", description: "", maxScore: "100" });
  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">New Assignment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" value={form.title} onChange={change} placeholder="Assignment title"
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select name="course" value={form.course} onChange={change}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                {courseOptions.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={change}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description / Instructions</label>
            <textarea name="description" value={form.description} onChange={change} rows={3}
              placeholder="Describe what students need to do..."
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
            <input name="maxScore" type="number" value={form.maxScore} onChange={change}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose} className="flex-1 border rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700">Create Assignment</button>
        </div>
      </div>
    </div>
  );
}