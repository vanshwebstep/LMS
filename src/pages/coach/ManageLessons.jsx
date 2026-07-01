import { useState } from "react";
import {
  Plus, ChevronDown, ChevronRight, Video, FileText,
  Edit2, Trash2, GripVertical, BookOpen
} from "lucide-react";

const initialSections = [
  {
    id: 1, title: "Getting Started", lessons: [
      { id: 101, title: "Introduction to the Course", type: "video",  duration: "05:30" },
      { id: 102, title: "Setting Up Your Environment", type: "video", duration: "12:00" },
      { id: 103, title: "Course Resources",            type: "pdf",   duration: ""      },
    ],
  },
  {
    id: 2, title: "Core Concepts", lessons: [
      { id: 201, title: "Components & Props",  type: "video", duration: "18:45" },
      { id: 202, title: "State & Lifecycle",   type: "video", duration: "22:10" },
      { id: 203, title: "Hooks Deep Dive",     type: "video", duration: "30:00" },
    ],
  },
];

const courseList = ["React Masterclass","Node.js Basics","CSS Advanced"];

export default function ManageLessons() {
  const [selectedCourse, setSelectedCourse] = useState(courseList[0]);
  const [sections,       setSections]       = useState(initialSections);
  const [expanded,       setExpanded]       = useState([1]);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showLessonModal,  setShowLessonModal]  = useState({ open: false, sectionId: null });

  const toggleExpand = (id) =>
    setExpanded((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);

  const deleteSection = (id) =>
    setSections((p) => p.filter((s) => s.id !== id));

  const deleteLesson = (sectionId, lessonId) =>
    setSections((p) =>
      p.map((s) =>
        s.id === sectionId ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) } : s
      )
    );

  const addSection = (title) => {
    setSections((p) => [...p, { id: Date.now(), title, lessons: [] }]);
    setShowSectionModal(false);
  };

  const addLesson = (sectionId, lesson) => {
    setSections((p) =>
      p.map((s) =>
        s.id === sectionId ? { ...s, lessons: [...s.lessons, { ...lesson, id: Date.now() }] } : s
      )
    );
    setShowLessonModal({ open: false, sectionId: null });
  };

  const totalLessons = sections.reduce((a, s) => a + s.lessons.length, 0);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Lessons</h2>
          <p className="text-sm text-gray-500 mt-1">{sections.length} sections â€¢ {totalLessons} lessons</p>
        </div>
        <button
          onClick={() => setShowSectionModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Add Section
        </button>
      </div>

      {/* Course Select */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
        <BookOpen size={18} className="text-indigo-500" />
        <span className="text-sm font-medium text-gray-700">Course:</span>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {courseList.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section, si) => (
          <div key={section.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b">
              <GripVertical size={16} className="text-gray-400 cursor-grab" />
              <button onClick={() => toggleExpand(section.id)} className="flex-1 flex items-center gap-2 text-left">
                {expanded.includes(section.id) ? (
                  <ChevronDown size={18} className="text-gray-500" />
                ) : (
                  <ChevronRight size={18} className="text-gray-500" />
                )}
                <span className="font-semibold text-gray-800">
                  Section {si + 1}: {section.title}
                </span>
                <span className="text-xs text-gray-400 ml-auto">{section.lessons.length} lessons</span>
              </button>
              <button
                onClick={() => setShowLessonModal({ open: true, sectionId: section.id })}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg"
              >
                <Plus size={13} /> Lesson
              </button>
              <button
                onClick={() => deleteSection(section.id)}
                className="p-1.5 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>

            {/* Lessons List */}
            {expanded.includes(section.id) && (
              <div className="divide-y divide-gray-50">
                {section.lessons.length === 0 ? (
                  <p className="text-center py-6 text-sm text-gray-400">No lessons yet. Add one above.</p>
                ) : (
                  section.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                      <GripVertical size={14} className="text-gray-300 cursor-grab" />
                      <div className={`p-1.5 rounded-lg ${lesson.type === "video" ? "bg-blue-100" : "bg-orange-100"}`}>
                        {lesson.type === "video"
                          ? <Video size={14} className="text-blue-500" />
                          : <FileText size={14} className="text-orange-500" />
                        }
                      </div>
                      <span className="flex-1 text-sm text-gray-700">{lesson.title}</span>
                      {lesson.duration && (
                        <span className="text-xs text-gray-400">{lesson.duration}</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        lesson.type === "video" ? "bg-blue-50 text-blue-500" : "bg-orange-50 text-orange-500"
                      }`}>
                        {lesson.type}
                      </span>
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-indigo-50 rounded">
                          <Edit2 size={13} className="text-indigo-400" />
                        </button>
                        <button
                          onClick={() => deleteLesson(section.id, lesson.id)}
                          className="p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Section Modal */}
      {showSectionModal && (
        <SectionModal onSave={addSection} onClose={() => setShowSectionModal(false)} />
      )}

      {/* Add Lesson Modal */}
      {showLessonModal.open && (
        <LessonModal
          sectionId={showLessonModal.sectionId}
          onSave={addLesson}
          onClose={() => setShowLessonModal({ open: false, sectionId: null })}
        />
      )}
    </div>
  );
}

/* â”€â”€â”€ Section Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function SectionModal({ onSave, onClose }) {
  const [title, setTitle] = useState("");
  return (
    <ModalShell title="Add Section" onClose={onClose}>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Getting Started"
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => title.trim() && onSave(title)}
            className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700">Add Section</button>
        </div>
      </div>
    </ModalShell>
  );
}

/* â”€â”€â”€ Lesson Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function LessonModal({ sectionId, onSave, onClose }) {
  const [form, setForm] = useState({ title: "", type: "video", duration: "", videoUrl: "" });
  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  return (
    <ModalShell title="Add Lesson" onClose={onClose}>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
          <input name="title" value={form.title} onChange={change} placeholder="e.g. Introduction"
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select name="type" value={form.type} onChange={change}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="video">Video</option>
              <option value="pdf">PDF / Notes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input name="duration" value={form.duration} onChange={change} placeholder="e.g. 10:30"
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
        {form.type === "video" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
            <input name="videoUrl" value={form.videoUrl} onChange={change} placeholder="https://..."
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => form.title.trim() && onSave(sectionId, form)}
            className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700">Add Lesson</button>
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
