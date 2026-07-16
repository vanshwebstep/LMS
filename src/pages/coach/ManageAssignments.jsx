import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Filter, ClipboardList, Eye, Edit2, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { formatDate } from "../../utils/formatters";

export default function ManageAssignments() {
  const [tab, setTab] = useState("assignments");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [showModal, setShowModal] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const [assignmentRes, courseRes] = await Promise.all([api.get("/coach/assignments"), api.get("/coach/courses")]);
      setAssignments(assignmentRes.assignments || []);
      setSubmissions(assignmentRes.submissions || []);
      setCourses(courseRes.courses || []);
      setError("");
    } catch (err) {
      setError(err?.message || "Assignments load nahi ho paaye");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, []);

  const courseOptions = useMemo(() => ["All Courses", ...new Set(courses.map((c) => c.title).filter(Boolean))], [courses]);
  const filtered = assignments.filter((a) => {
    const matchSearch = a.title?.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === "All Courses" || a.course?.title === courseFilter;
    return matchSearch && matchCourse;
  });

  const deleteAssignment = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await api.delete(`/coach/assignments/${id}`);
      toast.success("Assignment deleted");
      load();
    } catch (err) {
      toast.error(err?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold text-gray-800">Assignments</h2><p className="text-sm text-gray-500 mt-1">Create and review student assignments</p></div><button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"><Plus size={18} /> New Assignment</button></div>
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">{["assignments", "submissions"].map((t) => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{t}</button>)}</div>
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-center"><div className="relative flex-1 min-w-[200px]"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search assignments..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div><div className="flex items-center gap-2"><Filter size={16} className="text-gray-400" /><select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">{courseOptions.map((c) => <option key={c}>{c}</option>)}</select></div></div>
      {error && <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm">{error}</div>}

      {tab === "assignments" && <div className="bg-white rounded-2xl shadow-sm overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 border-b"><tr>{["Assignment", "Course", "Due Date", "Submissions", "Status", "Actions"].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{loading ? <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">Loading assignments...</td></tr> : filtered.length === 0 ? <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No assignments found</td></tr> : filtered.map((a) => (<tr key={a.id} className="hover:bg-gray-50 transition-colors"><td className="px-5 py-3"><div className="flex items-center gap-2"><ClipboardList size={16} className="text-indigo-400 flex-shrink-0" /><span className="font-medium text-gray-800">{a.title}</span></div></td><td className="px-5 py-3"><span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full">{a.course?.title || "-"}</span></td><td className="px-5 py-3 text-gray-500 text-xs">{a.dueAt ? formatDate(a.dueAt) : "-"}</td><td className="px-5 py-3"><div className="flex items-center gap-2"><div className="w-20 bg-gray-200 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${a.total ? (a.submissions / a.total) * 100 : 0}%` }} /></div><span className="text-xs text-gray-500">{a.submissions}/{a.total}</span></div></td><td className="px-5 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${a.status === "published" ? "bg-green-100 text-green-600" : a.status === "archived" ? "bg-gray-100 text-gray-500" : "bg-yellow-100 text-yellow-600"}`}>{a.status}</span></td><td className="px-5 py-3"><div className="flex gap-1"><button className="p-1.5 hover:bg-indigo-50 rounded-lg" title="View"><Eye size={14} className="text-indigo-400" /></button><button className="p-1.5 hover:bg-yellow-50 rounded-lg" title="Edit"><Edit2 size={14} className="text-yellow-500" /></button><button onClick={() => deleteAssignment(a.id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} className="text-red-400" /></button></div></td></tr>))}</tbody></table></div></div>}

      {tab === "submissions" && <div className="bg-white rounded-2xl shadow-sm overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 border-b"><tr>{["Student", "Assignment", "Submitted On", "Grade", "Status", "Action"].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{submissions.length === 0 ? <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No submissions yet</td></tr> : submissions.map((s) => (<tr key={s.id} className="hover:bg-gray-50 transition-colors"><td className="px-5 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">{(s.student_name || "S")[0]}</div><span className="font-medium text-gray-800">{s.student_name}</span></div></td><td className="px-5 py-3 text-gray-600 text-xs">{s.assignment_title}</td><td className="px-5 py-3 text-gray-500 text-xs">{s.submitted_at ? formatDate(s.submitted_at) : "-"}</td><td className="px-5 py-3"><span className={`font-bold ${s.score !== null ? "text-green-600" : "text-gray-400"}`}>{s.score ?? "-"}</span></td><td className="px-5 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${s.status === "graded" ? "bg-green-100 text-green-600" : s.status === "submitted" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-500"}`}>{s.status === "graded" && <CheckCircle size={11} />}{s.status === "submitted" && <Clock size={11} />}{s.status === "pending" && <XCircle size={11} />}{s.status}</span></td><td className="px-5 py-3"><button className="text-xs border px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition">View</button></td></tr>))}</tbody></table></div></div>}

      {showModal && <AssignmentModal onClose={() => setShowModal(false)} courses={courses} onCreated={load} />}
    </div>
  );
}

function AssignmentModal({ onClose, courses, onCreated }) {
  const [form, setForm] = useState({ title: "", courseId: courses[0]?.id || "", dueAt: "", description: "", maxScore: "100", status: "published" });
  const [saving, setSaving] = useState(false);
  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.title || !form.courseId) return toast.error("Title and course required");
    setSaving(true);
    try {
      await api.post("/coach/assignments", form);
      toast.success("Assignment created");
      onClose();
      onCreated();
    } catch (err) {
      toast.error(err?.message || "Assignment create nahi hua");
    } finally {
      setSaving(false);
    }
  };

  return <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-lg"><div className="flex items-center justify-between px-6 py-4 border-b"><h3 className="font-semibold text-gray-800">New Assignment</h3><button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button></div><div className="p-6 space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input name="title" value={form.title} onChange={change} placeholder="Assignment title" className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div><div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-gray-700 mb-1">Course</label><select name="courseId" value={form.courseId} onChange={change} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"><option value="">Select course</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label><input type="date" name="dueAt" value={form.dueAt} onChange={change} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Description / Instructions</label><textarea name="description" value={form.description} onChange={change} rows={3} placeholder="Describe what students need to do..." className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" /></div><div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label><input name="maxScore" type="number" value={form.maxScore} onChange={change} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select name="status" value={form.status} onChange={change} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></div></div></div><div className="flex gap-3 px-6 pb-5"><button onClick={onClose} className="flex-1 border rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50">Cancel</button><button onClick={submit} disabled={saving} className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-60">{saving ? "Creating..." : "Create Assignment"}</button></div></div></div>;
}