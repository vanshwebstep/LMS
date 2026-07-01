import { useState, useRef } from "react";
import {
  Upload, FileText, Trash2, Download, Search,
  BookOpen, Filter, Eye, FolderOpen
} from "lucide-react";

const mockMaterials = [
  { id: 1, name: "React Cheatsheet.pdf",       course: "React Masterclass", type: "PDF",  size: "1.2 MB", uploadedOn: "20 May 2025", downloads: 34 },
  { id: 2, name: "Hooks Reference Guide.pdf",  course: "React Masterclass", type: "PDF",  size: "840 KB", uploadedOn: "18 May 2025", downloads: 28 },
  { id: 3, name: "Node.js Notes.pdf",          course: "Node.js Basics",    type: "PDF",  size: "2.1 MB", uploadedOn: "15 May 2025", downloads: 19 },
  { id: 4, name: "CSS Flexbox Slides.pdf",     course: "CSS Advanced",      type: "PDF",  size: "3.4 MB", uploadedOn: "12 May 2025", downloads: 42 },
  { id: 5, name: "Project Starter Code.zip",   course: "React Masterclass", type: "ZIP",  size: "4.8 MB", uploadedOn: "10 May 2025", downloads: 55 },
];

const courseOptions = ["All Courses","React Masterclass","Node.js Basics","CSS Advanced"];

export default function UploadMaterials() {
  const [materials,    setMaterials]    = useState(mockMaterials);
  const [search,       setSearch]       = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [dragOver,     setDragOver]     = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [selCourse,    setSelCourse]    = useState(courseOptions[1]);
  const inputRef = useRef();

  const filtered = materials.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === "All Courses" || m.course === courseFilter;
    return matchSearch && matchCourse;
  });

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setTimeout(() => {
      const newFiles = Array.from(files).map((f) => ({
        id: Date.now() + Math.random(),
        name: f.name,
        course: selCourse,
        type: f.name.endsWith(".zip") ? "ZIP" : "PDF",
        size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedOn: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        downloads: 0,
      }));
      setMaterials((p) => [...newFiles, ...p]);
      setUploading(false);
    }, 1200);
  };

  const deleteMaterial = (id) => setMaterials((p) => p.filter((m) => m.id !== id));

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Upload Materials</h2>
        <p className="text-sm text-gray-500 mt-1">Upload PDFs, notes and resources for your students</p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-3">
          <BookOpen size={18} className="text-indigo-500" />
          <span className="text-sm font-medium text-gray-700">Upload for Course:</span>
          <select
            value={selCourse}
            onChange={(e) => setSelCourse(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {courseOptions.slice(1).map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.zip,.doc,.docx,.ppt,.pptx"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {uploading ? (
            <div className="space-y-2">
              <div className="w-10 h-10 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto" />
              <p className="text-sm text-indigo-600 font-medium">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload size={36} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">Drag & drop files here</p>
              <p className="text-sm text-gray-400 mt-1">or click to browse — PDF, ZIP, DOC, PPT</p>
              <span className="inline-block mt-3 bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition">
                Choose Files
              </span>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Search materials..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {courseOptions.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Materials List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">No materials found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["File","Course","Size","Uploaded","Downloads","Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${m.type === "PDF" ? "bg-red-100" : "bg-yellow-100"}`}>
                        <FileText size={15} className={m.type === "PDF" ? "text-red-500" : "text-yellow-600"} />
                      </div>
                      <span className="font-medium text-gray-800 text-xs">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">{m.course}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{m.size}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{m.uploadedOn}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Download size={12} /> {m.downloads}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-indigo-50 rounded-lg" title="Preview">
                        <Eye size={14} className="text-indigo-400" />
                      </button>
                      <button className="p-1.5 hover:bg-green-50 rounded-lg" title="Download">
                        <Download size={14} className="text-green-500" />
                      </button>
                      <button onClick={() => deleteMaterial(m.id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}