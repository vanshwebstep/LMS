import { useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle, Search, Filter, BookOpen, Users,
  Edit2, Trash2, Eye, MoreVertical
} from "lucide-react";

const mockCourses = [
  { id: 1, title: "React Masterclass 2025",  category: "Web Dev",    students: 45, lessons: 32, price: "₹999",  status: "Active", thumb: "⚛️" },
  { id: 2, title: "Node.js from Zero",       category: "Backend",    students: 32, lessons: 28, price: "₹799",  status: "Active", thumb: "🟩" },
  { id: 3, title: "CSS Advanced Techniques", category: "Design",     students: 18, lessons: 20, price: "₹599",  status: "Draft",  thumb: "🎨" },
  { id: 4, title: "JavaScript Deep Dive",    category: "Web Dev",    students: 60, lessons: 40, price: "₹1199", status: "Active", thumb: "📜" },
  { id: 5, title: "MongoDB Basics",          category: "Database",   students: 12, lessons: 15, price: "₹499",  status: "Draft",  thumb: "🍃" },
  { id: 6, title: "TypeScript Essentials",   category: "Web Dev",    students: 28, lessons: 22, price: "₹899",  status: "Active", thumb: "💙" },
];

const categories = ["All", "Web Dev", "Backend", "Design", "Database"];
const statuses   = ["All", "Active", "Draft"];

export default function MyCourses() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [status,   setStatus]   = useState("All");
  const [menuOpen, setMenuOpen] = useState(null);

  const filtered = mockCourses.filter((c) => {
    const matchSearch   = c.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || c.category === category;
    const matchStatus   = status   === "All" || c.status   === status;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} course(s) found</p>
        </div>
        <Link
          to="/coach/create-course"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
        >
          <PlusCircle size={18} />
          Create Course
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No courses found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              <div className="h-36 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-5xl">
                {course.thumb}
              </div>

              <div className="p-4">
                {/* Title & Status */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">{course.title}</h3>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === course.id ? null : course.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical size={16} className="text-gray-500" />
                    </button>
                    {menuOpen === course.id && (
                      <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-lg z-10">
                        <Link
                          to={`/coach/edit-course/${course.id}`}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setMenuOpen(null)}
                        >
                          <Edit2 size={14} /> Edit
                        </Link>
                        <Link
                          to={`/coach/course-detail/${course.id}`}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setMenuOpen(null)}
                        >
                          <Eye size={14} /> View
                        </Link>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 w-full">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category */}
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                  {course.category}
                </span>

                {/* Stats */}
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users size={13} /> {course.students} students
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={13} /> {course.lessons} lessons
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="font-bold text-indigo-600">{course.price}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    course.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {course.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}