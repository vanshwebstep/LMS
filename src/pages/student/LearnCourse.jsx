import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, ClipboardList, Download, HelpCircle, Paperclip, PlayCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { resolveMediaUrl } from "../../utils/media";

export default function LearnCourse() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [contentRes, assignmentRes, quizRes] = await Promise.all([
        api.get(`/student/courses/${courseId}/content`),
        api.get("/student/assignments"),
        api.get("/student/quizzes"),
      ]);
      setEnrollment(contentRes.enrollment || null);
      setLessons(contentRes.lessons || []);
      setAssignments((assignmentRes.assignments || []).filter((item) => item.assignment?.courseId === courseId));
      setQuizzes((quizRes.quizzes || []).filter((quiz) => quiz.courseId === courseId));
    } catch (err) {
      toast.error(err?.message || "Failed to load course content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [courseId]);

  const markComplete = async (lessonId) => {
    try {
      await api.patch(`/student/lessons/${lessonId}/progress`, { status: "completed" });
      toast.success("Lesson completed");
      load();
    } catch (err) {
      toast.error(err?.message || "Progress update failed");
    }
  };

  const completedLessons = lessons.filter((lesson) => lesson.progress?.status === "completed").length;
  const submittedAssignments = assignments.filter(({ submission }) => ["submitted", "graded"].includes(submission?.status)).length;
  const passedQuizzes = quizzes.filter((quiz) => Number(quiz.attempts || 0) > 0 && Number(quiz.avgScore || 0) >= Number(quiz.passingScore || 0)).length;
  const totalItems = lessons.length + assignments.length + quizzes.length;
  const completedItems = completedLessons + submittedAssignments + passedQuizzes;
  const percent = totalItems ? Math.round((completedItems / totalItems) * 100) : Number(enrollment?.progress || 0);

  return (
    <div className="space-y-6">
      <Link to="/student/my-learning" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700"><ArrowLeft size={16} /> Back to My Learning</Link>
      <div className="rounded-2xl bg-slate-900 p-6 text-white">
        <p className="text-sm font-bold text-sky-300">Course Progress</p>
        <h2 className="mt-2 text-3xl font-black">{percent}% complete</h2>
        <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-sky-400" style={{ width: `${percent}%` }} /></div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-slate-500">Loading course...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-2xl bg-white shadow-sm">
            <div className="border-b px-5 py-4"><h3 className="font-black text-slate-900">Lessons</h3></div>
            {lessons.length === 0 ? (
              <div className="p-10 text-center text-slate-500">No published lessons yet</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {lessons.map((lesson, index) => {
                  const done = lesson.progress?.status === "completed";
                  return (
                    <div key={lesson.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${done ? "bg-green-100 text-green-600" : "bg-sky-100 text-sky-600"}`}>{done ? <CheckCircle size={20} /> : <PlayCircle size={20} />}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase text-slate-400">Lesson {index + 1}</p>
                        <h3 className="font-bold text-slate-900">{lesson.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{lesson.description || lesson.contentType}</p>
                        {lesson.contentUrl && <a className="mt-2 inline-block text-sm font-semibold text-sky-700" href={resolveMediaUrl(lesson.contentUrl)} target="_blank" rel="noreferrer">Open content</a>}
                      </div>
                      <button onClick={() => markComplete(lesson.id)} disabled={done} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:bg-green-100 disabled:text-green-700">{done ? "Completed" : "Mark Complete"}</button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2"><ClipboardList size={18} className="text-sky-600" /><h3 className="font-black text-slate-900">Assignments</h3></div>
              {assignments.length === 0 ? (
                <p className="text-sm text-slate-500">No assignments yet</p>
              ) : (
                <div className="space-y-3">
                  {assignments.map(({ assignment, submission }) => {
                    const fileUrl = resolveMediaUrl(assignment.attachmentUrl);
                    return (
                      <div key={assignment.id} className="rounded-xl border p-3 hover:bg-slate-50">
                        <Link to={`/student/assignments/${assignment.id}/submit`} className="block">
                          <p className="font-bold text-slate-900">{assignment.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{submission ? `Status: ${submission.status}` : "Not submitted"}</p>
                        </Link>
                        {fileUrl && (
                          <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                            <a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1.5 text-xs font-black text-sky-700"><Paperclip size={13} /> View file</a>
                            <a href={fileUrl} download className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-black text-slate-700"><Download size={13} /> Download</a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2"><HelpCircle size={18} className="text-sky-600" /><h3 className="font-black text-slate-900">Quizzes</h3></div>
              {quizzes.length === 0 ? <p className="text-sm text-slate-500">No quizzes yet</p> : <div className="space-y-3">{quizzes.map((quiz) => <Link key={quiz.id} to={`/student/quizzes/${quiz.id}/attempt`} className="block rounded-xl border p-3 hover:bg-slate-50"><p className="font-bold text-slate-900">{quiz.title}</p><p className="mt-1 text-xs text-slate-500">{quiz.questions || 0} questions - pass {quiz.passingScore}%</p></Link>)}</div>}
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
