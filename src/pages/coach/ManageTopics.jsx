import { useState } from "react";
import { Plus, Edit2, Trash2, GripVertical, Tag, BookOpen, Save, X } from "lucide-react";

const courseOptions = ["React Masterclass", "Node.js Basics", "CSS Advanced"];

const initialTopics = [
  { id: 1, name: "JSX Fundamentals",       section: "Core Concepts",  order: 1, lessons: 4 },
  { id: 2, name: "Props & State",           section: "Core Concepts",  order: 2, lessons: 6 },
  { id: 3, name: "useEffect Hook",          section: "Hooks",          order: 1, lessons: 3 },
  { id: 4, name: "useState Hook",           section: "Hooks",          order: 2, lessons: 3 },
  { id: 5, name: "React Router",            section: "Advanced",       order: 1, lessons: 5 },
  { id: 6, name: "Context API",             section: "Advanced",       order: 2, lessons: 4 },
  { id: 7, name: "Environment Setup",       section: "Getting Started",order: 1, lessons: 2 },
];

export default function ManageTopics() {
  const [selectedCourse, setSelectedCourse] = useState(courseOptions[0]);
  const [topics,         setTopics]         = useState(initialTopics);
  const [editingId,      setEditingId]      = useState(null);
  const [editName,       setEditName]       = useState("");
  const [showAddModal,   setShowAddModal]   = useState(false);

  // Group by section
  const sections = [...new Set(topics.map((t) => t.section))];
  const grouped  = sections.reduce((acc, sec) => {
    acc[sec] = topics.filter((t) => t.section === sec).sort((a, b) => a.order - b.order);
    return acc;
  }, {});

  const startEdit = (topic) => { setEditingId(topic.id); setEditName(topic.name); };
  const saveEdit  = (id) => {
    if (editName.trim()) setTopics((p) => p.map((t) => t.id === id ? { ...t, name: editName } : t));
    setEditingId(null);
  };
  const deleteTopic = (id) => setTopics((p) => p.filter((t) => t.id !== id));

  const addTopic = ({ name, section }) => {
    setTopics((p) => [
      ...p,
      { id: Date.now(), name, section, order: p.filter((t) => t.section === section).length + 1, lessons: 0 },
    ]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Topics</h2>
          <p className="text-sm text-gray-500 mt-1">{topics.length} topics across {sections.length} sections</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Add Topic
        </button>
      </div>

      {/* Course Selector */}
      <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
        <BookOpen size={18} className="text-indigo-500" />
        <span className="text-sm font-medium text-gray-700">Course:</span>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {courseOptions.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Grouped Topics */}
      <div className="space-y-5">
        {Object.entries(grouped).map(([section, sTopics]) => (
          <div key={section} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center gap-2 px-5 py-3 bg-indigo-50 border-b">
              <Tag size={15} className="text-indigo-500" />
              <h3 className="font-semibold text-indigo-700 text-sm">{section}</h3>
              <span className="ml-auto text-xs text-indigo-400">{sTopics.length} topics</span>
            </div>

            {/* Topics */}
            <div className="divide-y divide-gray-50">
              {sTopics.map((topic) => (
                <div key={topic.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <GripVertical size={16} className="text-gray-300 cursor-grab flex-shrink-0" />

                  {editingId === topic.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(topic.id)}
                        autoFocus
                        className="flex-1 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                      <button onClick={() => saveEdit(topic.id)} className="p-1.5 bg-green-100 rounded-lg hover:bg-green-200">
                        <Save size={14} className="text-green-600" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <X size={14} className="text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-gray-700 font-medium">{topic.name}</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {topic.lessons} lessons
                      </span>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(topic)} className="p-1.5 hover:bg-indigo-50 rounded-lg">
                          <Edit2 size={14} className="text-indigo-400" />
                        </button>
                        <button onClick={() => deleteTopic(topic.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Topic Modal */}
      {showAddModal && (
        <AddTopicModal
          sections={sections}
          onSave={addTopic}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

/* ─── Add Topic Modal ─────────────────────────── */
function AddTopicModal({ sections, onSave, onClose }) {
  const [form, setForm] = useState({ name: "", section: sections[0] || "", newSection: "" });
  const [useNew, setUseNew] = useState(false);
  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = () => {
    const section = useNew ? form.newSection.trim() : form.section;
    if (!form.name.trim() || !section) return;
    onSave({ name: form.name.trim(), section });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Add Topic</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic Name</label>
            <input name="name" value={form.name} onChange={change} placeholder="e.g. useState Hook"
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Section</label>
              <button
                onClick={() => setUseNew((p) => !p)}
                className="text-xs text-indigo-600 hover:underline"
              >
                {useNew ? "Use existing" : "+ New section"}
              </button>
            </div>
            {useNew ? (
              <input name="newSection" value={form.newSection} onChange={change}
                placeholder="New section name"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            ) : (
              <select name="section" value={form.section} onChange={change}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                {sections.map((s) => <option key={s}>{s}</option>)}
              </select>
            )}
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose} className="flex-1 border rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700">
            Add Topic
          </button>
        </div>
      </div>
    </div>
  );
}