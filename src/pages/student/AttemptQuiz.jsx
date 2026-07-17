import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function AttemptQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    api.get("/student/quizzes").then((res) => {
      if (!alive) return;
      const found = (res.quizzes || []).find((item) => item.id === quizId);
      setQuiz(found || null);
    }).catch((err) => toast.error(err?.message || "Failed to load quiz")).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [quizId]);

  const submit = async () => {
    const questions = quiz?.questionItems || [];
    if (questions.some((question) => answers[question.id] === undefined)) return toast.error("Answer all questions before submitting");
    setSaving(true);
    try {
      const res = await api.post(`/student/quizzes/${quizId}/attempts`, { answers });
      setResult(res.attempt || null);
      toast.success(`Quiz ${res.attempt?.status || "submitted"}`);
    } catch (err) {
      toast.error(err?.message || "Quiz submit failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">Loading quiz...</div>;
  if (!quiz) return <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">Quiz not found</div>;

  return <div className="mx-auto max-w-3xl space-y-6"><Link to="/student/my-learning" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700"><ArrowLeft size={16} /> Back</Link><section className="rounded-2xl bg-slate-900 p-6 text-white"><p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">Quiz</p><h2 className="mt-3 text-3xl font-black">{quiz.title}</h2><p className="mt-3 text-sm leading-6 text-slate-300">{quiz.description || "Answer all questions and submit."}</p><div className="mt-4 flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-white/10 px-3 py-1">{quiz.course?.title || "Course"}</span><span className="rounded-full bg-white/10 px-3 py-1">Pass: {quiz.passingScore}%</span><span className="rounded-full bg-white/10 px-3 py-1">Questions: {quiz.questions}</span></div></section>{result ? <div className="rounded-2xl bg-white p-8 text-center shadow-sm"><CheckCircle className="mx-auto text-green-600" size={48} /><h3 className="mt-4 text-2xl font-black capitalize text-slate-900">{result.status}</h3><p className="mt-1 text-slate-500">Score: {result.score}%</p><button onClick={() => navigate("/student/my-learning")} className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white">Back to Learning</button></div> : <div className="space-y-4">{(quiz.questionItems || []).map((question, qIndex) => <div key={question.id} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase text-slate-400">Question {qIndex + 1}</p><h3 className="mt-1 font-black text-slate-900">{question.text}</h3><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">{(question.options || []).map((option, index) => <button key={index} onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: index }))} className={`rounded-xl border px-4 py-3 text-left text-sm font-bold ${answers[question.id] === index ? "border-sky-500 bg-sky-50 text-sky-700" : "text-slate-600 hover:bg-slate-50"}`}>{String.fromCharCode(65 + index)}. {option}</button>)}</div></div>)}{(quiz.questionItems || []).length === 0 && <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">No questions in this quiz yet</div>}<button onClick={submit} disabled={saving || !(quiz.questionItems || []).length} className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? "Submitting..." : "Submit Quiz"}</button></div>}</div>;
}
