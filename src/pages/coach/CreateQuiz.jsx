import { useEffect, useState } from "react";
import { CheckCircle, Plus, Save, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const emptyQuestion = () => ({ id: Date.now() + Math.random(), text: "", options: ["", "", "", ""], correct: 0, marks: 1 });

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [meta, setMeta] = useState({ title: "", description: "", courseId: "", passingScore: "60", status: "published" });
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    api.get("/coach/courses").then((res) => {
      if (!alive) return;
      const list = res.courses || [];
      setCourses(list);
      setMeta((prev) => ({ ...prev, courseId: prev.courseId || list[0]?.id || "" }));
    }).catch((err) => toast.error(err?.message || "Failed to load courses"));
    return () => { alive = false; };
  }, []);

  const changeMeta = (e) => setMeta((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const changeQuestion = (id, field, value) => setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, [field]: value } : q));
  const changeOption = (id, index, value) => setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, options: q.options.map((opt, i) => i === index ? value : opt) } : q));
  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);
  const removeQuestion = (id) => setQuestions((prev) => prev.length === 1 ? prev : prev.filter((q) => q.id !== id));

  const submit = async (status = meta.status) => {
    if (!meta.courseId || !meta.title.trim()) return toast.error("Course and quiz title required");
    if (questions.some((q) => !q.text.trim() || q.options.some((opt) => !opt.trim()))) return toast.error("All question fields required");
    setSaving(true);
    try {
      await api.post("/coach/quizzes", {
        ...meta,
        passingScore: Number(meta.passingScore || 60),
        status,
        questions: questions.map((q, index) => ({ text: q.text, options: q.options, correctAnswer: Number(q.correct), marks: Number(q.marks || 1), sortOrder: index + 1 })),
      });
      toast.success(status === "published" ? "Quiz published" : "Quiz saved as draft");
      navigate("/coach/quizzes");
    } catch (err) {
      toast.error(err?.message || "Quiz save failed");
    } finally {
      setSaving(false);
    }
  };

  return <div className="mx-auto max-w-3xl space-y-6"><div><h2 className="text-2xl font-bold text-gray-800">Create Quiz</h2><p className="mt-1 text-sm text-gray-500">Build MCQ quizzes linked with a real course.</p></div><div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm"><select name="courseId" value={meta.courseId} onChange={changeMeta} className="w-full rounded-lg border px-3 py-2.5 text-sm"><option value="">Select course</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select><input name="title" value={meta.title} onChange={changeMeta} placeholder="Quiz title" className="w-full rounded-lg border px-3 py-2.5 text-sm" /><textarea name="description" value={meta.description} onChange={changeMeta} rows={3} placeholder="Quiz description" className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm" /><div className="grid grid-cols-2 gap-3"><input name="passingScore" type="number" value={meta.passingScore} onChange={changeMeta} className="rounded-lg border px-3 py-2.5 text-sm" /><select name="status" value={meta.status} onChange={changeMeta} className="rounded-lg border px-3 py-2.5 text-sm"><option value="published">Published</option><option value="draft">Draft</option></select></div></div>{questions.map((question, qIndex) => <div key={question.id} className="space-y-3 rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="font-bold text-gray-700">Q{qIndex + 1}</span><input value={question.text} onChange={(e) => changeQuestion(question.id, "text", e.target.value)} placeholder="Question text" className="flex-1 rounded-lg border px-3 py-2.5 text-sm" /><button onClick={() => removeQuestion(question.id)} className="rounded-lg p-2 hover:bg-red-50"><Trash2 size={16} className="text-red-500" /></button></div>{question.options.map((option, index) => <div key={index} className="flex items-center gap-3"><button onClick={() => changeQuestion(question.id, "correct", index)} className={`h-7 w-7 rounded-full border text-xs font-bold ${Number(question.correct) === index ? "border-green-500 bg-green-500 text-white" : "border-gray-300 text-gray-400"}`}>{String.fromCharCode(65 + index)}</button><input value={option} onChange={(e) => changeOption(question.id, index, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + index)}`} className="flex-1 rounded-lg border px-3 py-2 text-sm" /></div>)}</div>)}<button onClick={addQuestion} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-300 py-4 text-sm font-medium text-indigo-600 hover:bg-indigo-50"><Plus size={18} /> Add Question</button><div className="flex gap-3 pb-6"><button onClick={() => submit("draft")} disabled={saving} className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium text-gray-600 disabled:opacity-60"><Save size={16} /> Save Draft</button><button onClick={() => submit("published")} disabled={saving} className="ml-auto flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-60"><CheckCircle size={16} /> {saving ? "Saving..." : "Publish Quiz"}</button></div></div>;
}
