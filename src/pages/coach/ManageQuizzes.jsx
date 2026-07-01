import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  HelpCircle,
  Users,
  CheckCircle,
  Clock,
  BarChart2,
  ChevronDown,
  Copy,
} from "lucide-react";

const ManageQuizzes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  const courses = [
    { id: "all", title: "All Courses" },
    { id: "1", title: "React.js Mastery" },
    { id: "2", title: "Node.js Backend" },
    { id: "3", title: "UI/UX Design" },
  ];

  const quizzes = [
    {
      id: 1,
      courseId: "1",
      courseName: "React.js Mastery",
      title: "React Basics Quiz",
      description: "Covers JSX, components and basic concepts",
      questions: 10,
      timeLimit: 20,
      attempts: 45,
      avgScore: 82,
      passingScore: 60,
      status: "published",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      courseId: "1",
      courseName: "React.js Mastery",
      title: "Hooks & State Management",
      description: "useState, useEffect, useContext deep dive",
      questions: 15,
      timeLimit: 30,
      attempts: 32,
      avgScore: 74,
      passingScore: 70,
      status: "published",
      createdAt: "2024-01-28",
    },
    {
      id: 3,
      courseId: "2",
      courseName: "Node.js Backend",
      title: "Express Fundamentals",
      description: "REST APIs, middleware and routing",
      questions: 12,
      timeLimit: 25,
      attempts: 28,
      avgScore: 79,
      passingScore: 65,
      status: "published",
      createdAt: "2024-02-05",
    },
    {
      id: 4,
      courseId: "2",
      courseName: "Node.js Backend",
      title: "Database Integration Quiz",
      description: "MySQL with Sequelize ORM",
      questions: 8,
      timeLimit: 15,
      attempts: 0,
      avgScore: 0,
      passingScore: 60,
      status: "draft",
      createdAt: "2024-02-20",
    },
    {
      id: 5,
      courseId: "3",
      courseName: "UI/UX Design",
      title: "Design Principles Quiz",
      description: "Color theory, typography and layout",
      questions: 20,
      timeLimit: 40,
      attempts: 19,
      avgScore: 88,
      passingScore: 70,
      status: "published",
      createdAt: "2024-03-01",
    },
  ];

  const filtered = quizzes.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCourse = selectedCourse === "all" || q.courseId === selectedCourse;
    return matchSearch && matchCourse;
  });

  const totalAttempts = quizzes.reduce((a, q) => a + q.attempts, 0);
  const publishedCount = quizzes.filter((q) => q.status === "published").length;
  const avgOverallScore =
    quizzes.filter((q) => q.attempts > 0).reduce((a, q) => a + q.avgScore, 0) /
    (quizzes.filter((q) => q.attempts > 0).length || 1);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Page Header */}
      <div className="border-b border-white/10 bg-[#13131f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Manage Quizzes</h1>
            <p className="text-sm text-gray-400">Create and manage quizzes for your courses</p>
          </div>
          <button
            onClick={() => navigate("/coach/create-quiz")}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Create Quiz
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: HelpCircle, label: "Total Quizzes", value: quizzes.length, color: "text-violet-400" },
            { icon: CheckCircle, label: "Published", value: publishedCount, color: "text-green-400" },
            { icon: Users, label: "Total Attempts", value: totalAttempts, color: "text-blue-400" },
            { icon: BarChart2, label: "Avg Score", value: `${Math.round(avgOverallScore)}%`, color: "text-yellow-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white/5 ${color}`}><Icon size={20} /></div>
              <div>
                <div className="font-bold text-xl">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 placeholder-gray-500"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-violet-500 appearance-none min-w-[180px]"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1a1a2e]">{c.title}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Quiz Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <HelpCircle size={40} className="mx-auto mb-3 opacity-30" />
            <p>No quizzes found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-violet-500/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                    <HelpCircle size={22} className="text-violet-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-base">{quiz.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${quiz.status === "published" ? "bg-green-400/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                        {quiz.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5 truncate">{quiz.description}</p>
                    <p className="text-xs text-violet-400 mt-1">{quiz.courseName}</p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><HelpCircle size={12} /> {quiz.questions} Questions</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {quiz.timeLimit} min</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {quiz.attempts} Attempts</span>
                      <span className="flex items-center gap-1"><BarChart2 size={12} /> Avg: {quiz.attempts > 0 ? `${quiz.avgScore}%` : "N/A"}</span>
                      <span className="flex items-center gap-1"><CheckCircle size={12} /> Pass: {quiz.passingScore}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      title="View Results"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      title="Edit Quiz"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Score Bar */}
                {quiz.attempts > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Average Score</span>
                      <span>{quiz.avgScore}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${quiz.avgScore >= 80 ? "bg-green-500" : quiz.avgScore >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${quiz.avgScore}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQuizzes;
