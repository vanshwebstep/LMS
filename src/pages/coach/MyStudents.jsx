import { useState } from "react";
import { Search, Filter, Users, BookOpen, Eye, MessageSquare } from "lucide-react";

const mockStudents = [
  { id: 1, name: "Rahul Sharma",  email: "rahul@email.com",  course: "React Masterclass",  progress: 75, joinDate: "10 May 2025", avatar: "R", status: "Active" },
  { id: 2, name: "Priya Singh",   email: "priya@email.com",  course: "Node.js Basics",     progress: 40, joinDate: "15 May 2025", avatar: "P", status: "Active" },
  { id: 3, name: "Amit Kumar",    email: "amit@email.com",   course: "React Masterclass",  progress: 90, joinDate: "02 May 2025", avatar: "A", status: "Active" },
  { id: 4, name: "Neha Gupta",    email: "neha@email.com",   course: "CSS Advanced",       progress: 20, joinDate: "20 May 2025", avatar: "N", status: "Inactive" },
  { id: 5, name: "Vikram Patel",  email: "vikram@email.com", course: "Node.js Basics",     progress: 60, joinDate: "08 May 2025", avatar: "V", status: "Active" },
  { id: 6, name: "Sunita Mehra",  email: "sunita@email.com", course: "React Masterclass",  progress: 55, joinDate: "12 May 2025", avatar: "S", status: "Active" },
];

const courseOptions = ["All Courses", "React Masterclass", "Node.js Basics", "CSS Advanced"];

export default function MyStudents() {
  const [search,       setSearch]       = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = mockStudents.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.email.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === "All Courses" || s.course === courseFilter;
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchCourse && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Students</h2>
        <p className="text-sm text-gray-500 mt-1">{filtered.length} student(s) enrolled</p>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Students", value: mockStudents.length, icon: Users, color: "text-indigo-600", bg: "bg-indigo-100" },
          { label: "Active Now",     value: mockStudents.filter((s) => s.status === "Active").length, icon: Users, color: "text-green-600", bg: "bg-green-100" },
          { label: "Avg Progress",   value: `${Math.round(mockStudents.reduce((a, b) => a + b.progress, 0) / mockStudents.length)}%`, icon: BookOpen, color: "text-yellow-600", bg: "bg-yellow-100" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
            <div className={`${item.bg} p-2.5 rounded-xl`}>
              <item.icon size={20} className={item.color} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-xl font-bold text-gray-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {courseOptions.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Progress</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Join Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <Users size={36} className="mx-auto mb-2 opacity-30" />
                    No students found
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    {/* Student */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
                          {s.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{s.name}</p>
                          <p className="text-xs text-gray-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Course */}
                    <td className="px-5 py-3">
                      <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full">
                        {s.course}
                      </span>
                    </td>
                    {/* Progress */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-24">
                          <div
                            className="h-1.5 rounded-full bg-indigo-500"
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{s.progress}%</span>
                      </div>
                    </td>
                    {/* Date */}
                    <td className="px-5 py-3 text-gray-500 text-xs">{s.joinDate}</td>
                    {/* Status */}
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        s.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-500 transition" title="View Progress">
                          <Eye size={15} />
                        </button>
                        <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-500 transition" title="Message">
                          <MessageSquare size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}