import { useState } from "react";
import { Plus, Trash2, CheckCircle, BookOpen, ChevronDown, ChevronUp, Save } from "lucide-react";

const courseOptions = ["React Masterclass","Node.js Basics","CSS Advanced"];

const emptyQuestion = () => ({
  id: Date.now(),
  text: "",
  options: ["", "", "", ""],
  correct: 0,
  expanded: true,
});

export default function CreateQuiz() {
  const [meta, setMeta] = useState({ title: "", course: courseOptions[0], duration: "30", passMark: "60" });
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [errors,    setErrors]    = useState({});

  const changeMeta = (e) => setMeta((p) => ({ ...p, [e.target.name]: e.target.value }));

  const addQuestion = () =>
    setQuestions((p) => [...p, emptyQuestion()]);

  const removeQuestion = (id) =>
    setQuestions((p) => p.filter((q) => q.id !== id));

  const toggleExpand = (id) =>
    setQuestions((p) => p.map((q) => q.id === id ? { ...q, expanded: !q.expanded } : q));

  const changeQuestion = (id, field, value) =>
    setQuestions((p) => p.map((q) => q.id === id ? { ...q, [field]: value } : q));

  const changeOption = (qId, idx, value) =>
    setQuestions((p) =>
      p.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.map((o, i) => (i === idx ? value : o)) }
          : q
      )
    );

  const setCorrect = (qId, idx) =>
    setQuestions((p) => p.map((q) => q.id === qId ? { ...q, correct: idx } : q));

  const validate = () => {
    const e = {};
    if (!meta.title.trim()) e.title = "Quiz title required";
    questions.forEach((q, i) => {
      if (!q.text.trim()) e[`q_${q.id}`] = `Question ${i + 1} text required`;
      if (q.options.some((o) => !o.trim())) e[`opt_${q.id}`] = `All options required in Q${i + 1}`;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (publish = false) => {
    if (!validate()) return;
    console.log("Save quiz", { meta, questions, publish });
    alert(publish ? "Quiz Published!" : "Saved as Draft!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Create Quiz</h2>
        <p className="text-sm text-gray-500 mt-1">Build MCQ quizzes for your students</p>
      </div>

      {/* Quiz Meta */}
      <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <BookOpen size={18} className="text-indigo-500" /> Quiz Details
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title <span className="text-red-500">*</span></label>
          <input name="title" value={meta.title} onChange={changeMeta}
            placeholder="e.g. React Hooks Assessment"
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.title ? "border-red-400" : ""}`} />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select name="course" value={meta.course} onChange={changeMeta}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
              {courseOptions.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
            <input name="duration" type="number" value={meta.duration} onChange={changeMeta}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pass Mark (%)</label>
            <input name="passMark" type="number" value={meta.passMark} onChange={changeMeta}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Question Header */}
            <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b">
              <span className="text-sm font-semibold text-gray-600">Q{idx + 1}</span>
              <span className="flex-1 text-sm text-gray-700 truncate">
                {q.text || "New Question"}
              </span>
              <button onClick={() => toggleExpand(q.id)} className="p-1 hover:bg-gray-200 rounded">
                {q.expanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
              </button>
              {questions.length > 1 && (
                <button onClick={() => removeQuestion(q.id)} className="p-1 hover:bg-red-50 rounded">
                  <Trash2 size={15} className="text-red-400" />
                </button>
              )}
            </div>

            {q.expanded && (
              <div className="p-5 space-y-4">
                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question <span className="text-red-500">*</span></label>
                  <textarea
                    value={q.text}
                    onChange={(e) => changeQuestion(q.id, "text", e.target.value)}
                    rows={2} placeholder="Type your question here..."
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none ${
                      errors[`q_${q.id}`] ? "border-red-400" : ""
                    }`}
                  />
                  {errors[`q_${q.id}`] && <p className="text-red-500 text-xs mt-1">{errors[`q_${q.id}`]}</p>}
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Options <span className="text-xs text-gray-400 font-normal">(click ✓ to mark correct answer)</span>
                  </label>
                  {q.options.map((opt, oi) => (
                    <div key={oi} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${
                      q.correct === oi ? "border-green-400 bg-green-50" : "border-gray-200"
                    }`}>
                      <button
                        onClick={() => setCorrect(q.id, oi)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          q.correct === oi
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300 hover:border-green-400"
                        }`}
                      >
                        {q.correct === oi && <CheckCircle size={14} className="text-white" />}
                      </button>
                      <span className="text-xs font-bold text-gray-400 w-4">
                        {["A","B","C","D"][oi]}
                      </span>
                      <input
                        value={opt}
                        onChange={(e) => changeOption(q.id, oi, e.target.value)}
                        placeholder={`Option ${["A","B","C","D"][oi]}`}
                        className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700"
                      />
                    </div>
                  ))}
                  {errors[`opt_${q.id}`] && (
                    <p className="text-red-500 text-xs">{errors[`opt_${q.id}`]}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Question */}
      <button
        onClick={addQuestion}
        className="w-full border-2 border-dashed border-indigo-300 rounded-2xl py-4 text-sm font-medium text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50 transition flex items-center justify-center gap-2"
      >
        <Plus size={18} /> Add Question
      </button>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pb-6">
        <button
          onClick={() => handleSave(false)}
          className="flex items-center gap-2 border px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          <Save size={16} /> Save Draft
        </button>
        <button
          onClick={() => handleSave(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition ml-auto"
        >
          <CheckCircle size={16} /> Publish Quiz
        </button>
      </div>
    </div>
  );
}