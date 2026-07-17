import { useEffect, useMemo, useState } from "react";
import { BookOpen, Edit2, Plus, Trash2, Video } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { confirmDialog } from "../../utils/dialogs";

const emptyForm = { courseId: "", title: "", description: "", contentType: "video", contentUrl: "", durationMinutes: "0", sortOrder: "0", status: "published", isPreview: false };

export default function ManageLessons() {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const [courseRes, lessonRes] = await Promise.all([api.get("/coach/courses"), api.get("/coach/lessons")]);
      setCourses(courseRes.courses || []);
      setLessons(lessonRes.lessons || []);
    } catch (err) {
      toast.error(err?.message || "Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => selectedCourse === "All" ? lessons : lessons.filter((lesson) => lesson.courseId === selectedCourse), [lessons, selectedCourse]);

  const openCreate = () => { setEditing(null); setShowModal(true); };
  const openEdit = (lesson) => { setEditing(lesson); setShowModal(true); };

  const remove = async (id) => {
    const ok = await confirmDialog({ title: "Delete lesson?", message: "This lesson will be removed from the course content.", confirmText: "Delete Lesson", tone: "danger" });
    if (!ok) return;
    try {
      await api.delete(`/coach/lessons/${id}`);
      toast.success("Lesson deleted");
      load();
    } catch (err) {
      toast.error(err?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Lessons</h2>
          <p className="mt-1 text-sm text-gray-500">{loading ? "Loading lessons..." : `${filtered.length} lesson(s) found`}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"><Plus size={18} /> Add Lesson</button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <BookOpen size={18} className="text-indigo-500" />
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
          <option value="All">All Courses</option>
          {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-bold uppercase text-gray-500">
            <tr><th className="px-5 py-3">Lesson</th><th className="px-5 py-3">Course</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Duration</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={6} className="py-10 text-center text-gray-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={6} className="py-10 text-center text-gray-400">No lessons found</td></tr> : filtered.map((lesson) => (
              <tr key={lesson.id} className="hover:bg-gray-50">
                <td className="px-5 py-3"><div className="flex items-center gap-2"><Video size={15} className="text-indigo-500" /><span className="font-semibold text-gray-800">{lesson.title}</span></div></td>
                <td className="px-5 py-3 text-gray-600">{lesson.course?.title || "-"}</td>
                <td className="px-5 py-3 text-gray-600">{lesson.contentType}</td>
                <td className="px-5 py-3 text-gray-600">{lesson.durationMinutes || 0} min</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${lesson.status === "published" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>{lesson.status}</span></td>
                <td className="px-5 py-3"><div className="flex gap-1"><button onClick={() => openEdit(lesson)} className="rounded-lg p-1.5 hover:bg-indigo-50"><Edit2 size={14} className="text-indigo-500" /></button><button onClick={() => remove(lesson.id)} className="rounded-lg p-1.5 hover:bg-red-50"><Trash2 size={14} className="text-red-500" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <LessonModal courses={courses} lesson={editing} onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); load(); }} />}
    </div>
  );
}

function LessonModal({ courses, lesson, onClose, onSaved }) {
  const [form, setForm] = useState(() => lesson ? { ...emptyForm, ...lesson, durationMinutes: String(lesson.durationMinutes || 0), sortOrder: String(lesson.sortOrder || 0) } : { ...emptyForm, courseId: courses[0]?.id || "" });
  const [saving, setSaving] = useState(false);
  const change = (e) => { const { name, value, type, checked } = e.target; setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value })); };
  const submit = async () => {
    if (!form.courseId || !form.title.trim()) return toast.error("Course and title required");
    setSaving(true);
    try {
      const payload = { ...form, durationMinutes: Number(form.durationMinutes || 0), sortOrder: Number(form.sortOrder || 0) };
      if (lesson) await api.put(`/coach/lessons/${lesson.id}`, payload); else await api.post("/coach/lessons", payload);
      toast.success(lesson ? "Lesson updated" : "Lesson created");
      onSaved();
    } catch (err) {
      toast.error(err?.message || "Lesson save failed");
    } finally {
      setSaving(false);
    }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-lg rounded-2xl bg-white shadow-xl"><div className="flex items-center justify-between border-b px-6 py-4"><h3 className="font-semibold text-gray-800">{lesson ? "Edit Lesson" : "Add Lesson"}</h3><button onClick={onClose} className="text-xl text-gray-400">&times;</button></div><div className="space-y-4 p-6"><select name="courseId" value={form.courseId} onChange={change} className="w-full rounded-lg border px-3 py-2.5 text-sm"><option value="">Select course</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select><input name="title" value={form.title} onChange={change} placeholder="Lesson title" className="w-full rounded-lg border px-3 py-2.5 text-sm" /><textarea name="description" value={form.description || ""} onChange={change} rows={3} placeholder="Description" className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm" /><div className="grid grid-cols-2 gap-3"><select name="contentType" value={form.contentType} onChange={change} className="rounded-lg border px-3 py-2.5 text-sm"><option value="video">Video</option><option value="document">Document</option><option value="link">Link</option><option value="text">Text</option></select><input name="durationMinutes" type="number" value={form.durationMinutes} onChange={change} className="rounded-lg border px-3 py-2.5 text-sm" /></div><input name="contentUrl" value={form.contentUrl || ""} onChange={change} placeholder="Content URL" className="w-full rounded-lg border px-3 py-2.5 text-sm" /><div className="grid grid-cols-2 gap-3"><input name="sortOrder" type="number" value={form.sortOrder} onChange={change} className="rounded-lg border px-3 py-2.5 text-sm" /><select name="status" value={form.status} onChange={change} className="rounded-lg border px-3 py-2.5 text-sm"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div><label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" name="isPreview" checked={Boolean(form.isPreview)} onChange={change} /> Free preview</label></div><div className="flex gap-3 px-6 pb-5"><button onClick={onClose} className="flex-1 rounded-xl border py-2.5 text-sm text-gray-600">Cancel</button><button onClick={submit} disabled={saving} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white disabled:opacity-60">{saving ? "Saving..." : "Save"}</button></div></div></div>;
}
