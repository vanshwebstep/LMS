import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Edit2, BookOpen, Users, DollarSign,
  ClipboardList, PlayCircle, Tag, Clock, Star,
  BarChart2, CheckCircle
} from "lucide-react";

const course = {
  id: 1,
  title: "React Masterclass 2025",
  category: "Web Development",
  difficulty: "Intermediate",
  language: "Hinglish",
  description: "A complete guide to React.js â€” from basics to advanced patterns including Hooks, Context, React Router and more.",
  students: 45,
  lessons: 32,
  sections: 6,
  revenue: "â‚¹44,955",
  rating: 4.7,
  reviews: 28,
  status: "Active",
  thumb: "âš›ï¸",
  plans: [
    { name: "Basic", price: "â‚¹499", duration: "30 days", buyers: 10 },
    { name: "Pro",   price: "â‚¹999", duration: "90 days", buyers: 30 },
    { name: "Premium",price:"â‚¹1,999",duration:"Lifetime",buyers: 5  },
  ],
  recentStudents: [
    { name: "Rahul Sharma", plan: "Pro",     progress: 75, joined: "28 May" },
    { name: "Priya Singh",  plan: "Basic",   progress: 40, joined: "27 May" },
    { name: "Amit Kumar",   plan: "Premium", progress: 90, joined: "25 May" },
    { name: "Neha Gupta",   plan: "Pro",     progress: 20, joined: "24 May" },
  ],
};

const tabs = ["Overview","Students","Plans","Analytics"];

export default function CourseDetail() {
  const { id = course.id } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <Link to="/coach/my-courses" className="mt-1 p-2 hover:bg-gray-100 rounded-xl transition">
          <ArrowLeft size={20} className="text-gray-500" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-gray-800">{course.title}</h2>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              course.status === "Active" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
            }`}>{course.status}</span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1"><Tag size={12} /> ID: {id}</span><span className="flex items-center gap-1"><Tag size={12} /> {course.category}</span>
            <span className="flex items-center gap-1"><BarChart2 size={12} /> {course.difficulty}</span>
            <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400" fill="currentColor" /> {course.rating} ({course.reviews} reviews)</span>
          </div>
        </div>
        <Link
          to={`/coach/edit-course/${course.id}`}
          className="flex items-center gap-2 border px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          <Edit2 size={15} /> Edit Course
        </Link>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Students",    value: course.students, icon: Users,         color: "text-indigo-600", bg: "bg-indigo-100" },
          { label: "Lessons",     value: course.lessons,  icon: PlayCircle,    color: "text-blue-600",   bg: "bg-blue-100"   },
          { label: "Revenue",     value: course.revenue,  icon: DollarSign,    color: "text-green-600",  bg: "bg-green-100"  },
          { label: "Assignments", value: 8,               icon: ClipboardList, color: "text-orange-500", bg: "bg-orange-100" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
            <div className={`${s.bg} p-2.5 rounded-xl`}><s.icon size={18} className={s.color} /></div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-lg font-bold text-gray-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === t ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>{t}</button>
        ))}
      </div>

      {/* â”€â”€ Overview Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-5 space-y-4">
            <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-6xl">
              {course.thumb}
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {[
                { label: "Language",   value: course.language   },
                { label: "Sections",   value: course.sections   },
                { label: "Duration",   value: "~24 hrs"         },
              ].map((i) => (
                <div key={i.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">{i.label}</p>
                  <p className="font-semibold text-gray-700 mt-0.5">{i.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
            <h3 className="font-semibold text-gray-700">Quick Actions</h3>
            {[
              { label: "Manage Lessons",     to: "/coach/manage-lessons",     icon: BookOpen      },
              { label: "Manage Topics",      to: "/coach/manage-topics",      icon: Tag           },
              { label: "Assignments",        to: "/coach/assignments",        icon: ClipboardList },
              { label: "Pricing Plans",      to: "/coach/pricing-plans",      icon: DollarSign    },
            ].map((a) => (
              <Link key={a.label} to={a.to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 transition-colors border">
                <a.icon size={16} className="text-indigo-500" />
                <span className="text-sm text-gray-700">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* â”€â”€ Students Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "Students" && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Student","Plan","Progress","Joined"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {course.recentStudents.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {s.name[0]}
                      </div>
                      <span className="font-medium text-gray-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">{s.plan}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-xs text-gray-600">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{s.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* â”€â”€ Plans Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "Plans" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {course.plans.map((p) => (
            <div key={p.name} className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
              <h3 className="font-bold text-gray-800 text-lg">{p.name}</h3>
              <p className="text-2xl font-extrabold text-indigo-600">{p.price}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={12} /> {p.duration}
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCircle size={13} /> {p.buyers} students enrolled
              </div>
            </div>
          ))}
        </div>
      )}

      {/* â”€â”€ Analytics Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "Analytics" && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Enrollment Trend</h3>
          <div className="flex items-end gap-2 h-40">
            {[10, 18, 25, 30, 35, 40, 42, 43, 44, 45].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-indigo-400 rounded-t hover:bg-indigo-600 transition-colors"
                  style={{ height: `${(v / 45) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Mar</span><span>Apr</span><span>May</span>
          </div>
        </div>
      )}
    </div>
  );
}
