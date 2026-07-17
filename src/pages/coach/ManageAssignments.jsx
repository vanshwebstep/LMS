import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Filter, ClipboardList, Eye, Edit2, Trash2, CheckCircle, Clock, XCircle, Upload, Paperclip } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { confirmDialog } from "../../utils/dialogs";
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
      setError(err?.message || "Failed to load assignments");
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
    const ok = await confirmDialog({ title: "Delete assignment?", message: "This assignment will be removed for students.", confirmText: "Delete Assignment", tone: "danger" });
    if (!ok) return;
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
      <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold text-gray-800">Assignments</h2><p className="mt-1 text-sm text-gray-500">Create questions, attach files, and review submissions</p></div><button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"><Plus size={18} /> New Assignment</button></div>
      <div className="flex w-fit gap-1 rounded-xl bg-gray-100 p-1">{["assignments", "submissions"].map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{t}</button>)}</div>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"><div className="relative min-w-[200px] flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search assignments..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div><div className="flex items-center gap-2"><Filter size={16} className="text-gray-400" /><select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">{courseOptions.map((c) => <option key={c}>{c}</option>)}</select></div></div>
      {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      {tab === "assignments" && <div className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b bg-gray-50"><tr>{["Assignment", "Course", "Attachment", "Due Date", "Submissions", "Status", "Actions"].map((h) => <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{loading ? <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">Loading assignments...</td></tr> : filtered.length === 0 ? <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No assignments found</td></tr> : filtered.map((a) => (<tr key={a.id} className="transition-colors hover:bg-gray-50"><td className="px-5 py-3"><div className="flex items-center gap-2"><ClipboardList size={16} className="flex-shrink-0 text-indigo-400" /><span className="font-medium text-gray-800">{a.title}</span></div></td><td className="px-5 py-3"><span className="rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-600">{a.course?.title || "-"}</span></td><td className="px-5 py-3">{a.attachmentUrl ? <a href={a.attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600"><Paperclip size={13} /> {a.attachmentName || "Open file"}</a> : <span className="text-xs text-gray-400">-</span>}</td><td className="px-5 py-3 text-xs text-gray-500">{a.dueAt ? formatDate(a.dueAt) : "-"}</td><td className="px-5 py-3"><div className="flex items-center gap-2"><div className="h-1.5 w-20 rounded-full bg-gray-200"><div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${a.total ? (a.submissions / a.total) * 100 : 0}%` }} /></div><span className="text-xs text-gray-500">{a.submissions}/{a.total}</span></div></td><td className="px-5 py-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${a.status === "published" ? "bg-green-100 text-green-600" : a.status === "archived" ? "bg-gray-100 text-gray-500" : "bg-yellow-100 text-yellow-600"}`}>{a.status}</span></td><td className="px-5 py-3"><div className="flex gap-1"><button className="rounded-lg p-1.5 hover:bg-indigo-50" title="View"><Eye size={14} className="text-indigo-400" /></button><button className="rounded-lg p-1.5 hover:bg-yellow-50" title="Edit"><Edit2 size={14} className="text-yellow-500" /></button><button onClick={() => deleteAssignment(a.id)} className="rounded-lg p-1.5 hover:bg-red-50" title="Delete"><Trash2 size={14} className="text-red-400" /></button></div></td></tr>))}</tbody></table></div></div>}

      {tab === "submissions" && <div className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b bg-gray-50"><tr>{["Student", "Assignment", "Submitted On", "File", "Grade", "Status"].map((h) => <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{submissions.length === 0 ? <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No submissions yet</td></tr> : submissions.map((s) => (<tr key={s.id} className="transition-colors hover:bg-gray-50"><td className="px-5 py-3"><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">{(s.student_name || "S")[0]}</div><span className="font-medium text-gray-800">{s.student_name}</span></div></td><td className="px-5 py-3 text-xs text-gray-600">{s.assignment_title}</td><td className="px-5 py-3 text-xs text-gray-500">{s.submitted_at ? formatDate(s.submitted_at) : "-"}</td><td className="px-5 py-3">{s.file_url ? <a href={s.file_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600">Open file</a> : <span className="text-xs text-gray-400">-</span>}</td><td className="px-5 py-3"><span className={`font-bold ${s.score !== null ? "text-green-600" : "text-gray-400"}`}>{s.score ?? "-"}</span></td><td className="px-5 py-3"><span className={`flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${s.status === "graded" ? "bg-green-100 text-green-600" : s.status === "submitted" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-500"}`}>{s.status === "graded" && <CheckCircle size={11} />}{s.status === "submitted" && <Clock size={11} />}{s.status === "pending" && <XCircle size={11} />}{s.status}</span></td></tr>))}</tbody></table></div></div>}

      {showModal && <AssignmentModal onClose={() => setShowModal(false)} courses={courses} onCreated={load} />}
    </div>
  );
}

function AssignmentModal({ onClose, courses, onCreated }) {
  const [form, setForm] = useState({ title: "", courseId: courses[0]?.id || "", dueAt: "", description: "", maxScore: "100", status: "published" });
  const [attachment, setAttachment] = useState(null);
  const [saving, setSaving] = useState(false);
  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const uploadAttachment = async () => {
    if (!attachment) return { url: "", name: "" };
    const data = new FormData();
    data.append("file", attachment);
    const res = await api.post("/upload/document", data, { headers: { "Content-Type": "multipart/form-data" } });
    return { url: res.upload?.url || res.material?.url || "", name: res.upload?.name || res.material?.name || attachment.name };
  };
  const submit = async () => {
    if (!form.title || !form.courseId) return toast.error("Title and course required");
    if (!form.description.trim() && !attachment) return toast.error("Add a question/instruction or attach a file");
    setSaving(true);
    try {
      const uploaded = await uploadAttachment();
      await api.post("/coach/assignments", { ...form, attachmentUrl: uploaded.url, attachmentName: uploaded.name });
      toast.success("Assignment created");
      onClose();
      onCreated();
    } catch (err) {
      toast.error(err?.message || "Failed to create assignment");
    } finally {
      setSaving(false);
    }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-2xl bg-white shadow-xl"><div className="flex items-center justify-between border-b px-6 py-4"><h3 className="font-semibold text-gray-800">New Assignment</h3><button onClick={onClose} className="text-xl text-gray-400 hover:text-gray-600">&times;</button></div><div className="space-y-4 p-6"><div><label className="mb-1 block text-sm font-medium text-gray-700">Title</label><input name="title" value={form.title} onChange={change} placeholder="Assignment title" className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div><div className="grid grid-cols-2 gap-3"><div><label className="mb-1 block text-sm font-medium text-gray-700">Course</label><select name="courseId" value={form.courseId} onChange={change} className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"><option value="">Select course</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div><div><label className="mb-1 block text-sm font-medium text-gray-700">Due Date</label><input type="date" name="dueAt" value={form.dueAt} onChange={change} className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div></div><div><label className="mb-1 block text-sm font-medium text-gray-700">Question / Instructions</label><textarea name="description" value={form.description} onChange={change} rows={4} placeholder="Write the question, structure, or assignment instructions..." className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 p-4 hover:border-indigo-400 hover:bg-indigo-50/40"><Upload size={20} className="text-indigo-500" /><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-gray-700">{attachment ? attachment.name : "Attach question file or structure"}</span><span className="text-xs text-gray-400">PDF, DOC, image, ZIP, PPT, or any study file</span></span><input type="file" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0] || null)} /></label><div className="grid grid-cols-2 gap-3"><div><label className="mb-1 block text-sm font-medium text-gray-700">Max Score</label><input name="maxScore" type="number" value={form.maxScore} onChange={change} className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div><div><label className="mb-1 block text-sm font-medium text-gray-700">Status</label><select name="status" value={form.status} onChange={change} className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></div></div></div><div className="flex gap-3 px-6 pb-5"><button onClick={onClose} className="flex-1 rounded-xl border py-2.5 text-sm text-gray-600 hover:bg-gray-50">Cancel</button><button onClick={submit} disabled={saving} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">{saving ? "Creating..." : "Create Assignment"}</button></div></div></div>;
}
