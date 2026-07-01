import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  Video,
  FileText,
  Link2,
  Trash2,
  GripVertical,
  EyeOff,
  Play,
  File,
  CheckCircle,
  ChevronDown,
} from "lucide-react";

const CONTENT_TYPES = [
  { type: "video", icon: Video, label: "Video Upload", color: "text-red-400 bg-red-400/10" },
  { type: "text", icon: FileText, label: "Text / Article", color: "text-blue-400 bg-blue-400/10" },
  { type: "url", icon: Link2, label: "External URL", color: "text-green-400 bg-green-400/10" },
  { type: "file", icon: File, label: "Attachment", color: "text-yellow-400 bg-yellow-400/10" },
];

const CreateLesson = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const fileRef = useRef(null);
  const contentBlockIdRef = useRef(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [lesson, setLesson] = useState({
    title: "",
    description: "",
    duration: "",
    status: "draft",
    isFreePreview: false,
    order: 1,
    contentBlocks: [],
  });

  const addContentBlock = (type) => {
    const newBlock = {
      id: contentBlockIdRef.current++,
      type,
      content: "",
      title: "",
      file: null,
    };
    setLesson((l) => ({ ...l, contentBlocks: [...l.contentBlocks, newBlock] }));
  };

  const updateBlock = (id, field, value) => {
    setLesson((l) => ({
      ...l,
      contentBlocks: l.contentBlocks.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    }));
  };

  const removeBlock = (id) => {
    setLesson((l) => ({ ...l, contentBlocks: l.contentBlocks.filter((b) => b.id !== id) }));
  };

  const handleSave = async (status = "draft") => {
    setLesson((l) => ({ ...l, status }));
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); navigate(-1); }, 1500);
  };

  const ContentBlockIcon = ({ type }) => {
    const found = CONTENT_TYPES.find((c) => c.type === type);
    if (!found) return null;
    const { icon: Icon, color } = found;
    return <div className={`p-2 rounded-lg ${color}`}><Icon size={16} /></div>;
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#13131f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Create New Lesson</h1>
            <p className="text-sm text-gray-400">Add lesson details and content below</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="flex items-center gap-2 border border-white/20 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              <EyeOff size={15} />
              Save Draft
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving || !lesson.title}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                saved ? "bg-green-600" : "bg-violet-600 hover:bg-violet-700"
              } disabled:opacity-50`}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : saved ? (
                <CheckCircle size={15} />
              ) : (
                <Save size={15} />
              )}
              {saving ? "Saving..." : saved ? "Saved!" : "Publish Lesson"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><FileText size={16} className="text-violet-400" /> Lesson Details</h2>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Lesson Title *</label>
              <input
                type="text"
                value={lesson.title}
                onChange={(e) => setLesson((l) => ({ ...l, title: e.target.value }))}
                placeholder="e.g. Introduction to React Hooks"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Description (Optional)</label>
              <textarea
                rows={3}
                value={lesson.description}
                onChange={(e) => setLesson((l) => ({ ...l, description: e.target.value }))}
                placeholder="Brief overview of what students will learn in this lesson..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 resize-none placeholder-gray-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Duration (optional)</label>
                <input
                  type="text"
                  value={lesson.duration}
                  onChange={(e) => setLesson((l) => ({ ...l, duration: e.target.value }))}
                  placeholder="e.g. 45 min"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 placeholder-gray-600"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Lesson Order</label>
                <input
                  type="number"
                  min={1}
                  value={lesson.order}
                  onChange={(e) => setLesson((l) => ({ ...l, order: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Content Blocks */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2"><Play size={16} className="text-violet-400" /> Lesson Content</h2>
              <span className="text-xs text-gray-500">{lesson.contentBlocks.length} blocks added</span>
            </div>

            {lesson.contentBlocks.length === 0 ? (
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center">
                <Upload size={32} className="mx-auto mb-2 text-gray-600" />
                <p className="text-gray-500 text-sm">No content added yet</p>
                <p className="text-gray-600 text-xs mt-1">Add a content block below</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lesson.contentBlocks.map((block) => (
                  <div key={block.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 cursor-grab text-gray-600 hover:text-gray-400"><GripVertical size={16} /></div>
                      <ContentBlockIcon type={block.type} />
                      <div className="flex-1 space-y-2">
                        <div className="text-xs font-medium text-gray-400 capitalize">{block.type} Block</div>
                        <input
                          type="text"
                          value={block.title}
                          onChange={(e) => updateBlock(block.id, "title", e.target.value)}
                          placeholder="Block title (optional)"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 placeholder-gray-600"
                        />
                        {block.type === "text" && (
                          <textarea
                            rows={4}
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                            placeholder="Write lesson content here..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 resize-none placeholder-gray-600"
                          />
                        )}
                        {block.type === "url" && (
                          <input
                            type="url"
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 placeholder-gray-600"
                          />
                        )}
                        {(block.type === "video" || block.type === "file") && (
                          <div
                            onClick={() => (block.type === "video" ? videoRef : fileRef).current?.click()}
                            className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer hover:border-violet-500/50 transition-colors"
                          >
                            {block.file ? (
                              <p className="text-sm text-violet-400">{block.file.name}</p>
                            ) : (
                              <p className="text-sm text-gray-500">Click to upload {block.type}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeBlock(block.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-600 hover:text-red-400 transition-colors mt-0.5"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Content Buttons */}
            <div>
              <p className="text-xs text-gray-600 mb-2">Add content block:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONTENT_TYPES.map(({ type, icon: Icon, label, color }) => (
                  <button
                    key={type}
                    onClick={() => addContentBlock(type)}
                    className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl border border-white/10 hover:border-violet-500/50 hover:bg-white/5 transition-all group"
                  >
                    <div className={`p-2 rounded-lg ${color}`}><Icon size={16} /></div>
                    <span className="text-xs text-gray-500 group-hover:text-gray-300">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-sm">Lesson Settings</h3>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Status</label>
              <div className="relative">
                <select
                  value={lesson.status}
                  onChange={(e) => setLesson((l) => ({ ...l, status: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 appearance-none"
                >
                  <option value="draft" className="bg-[#1a1a2e]">Draft</option>
                  <option value="published" className="bg-[#1a1a2e]">Published</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Free Preview Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Free Preview</p>
                <p className="text-xs text-gray-500">Allow non-enrolled students to view</p>
              </div>
              <button
                onClick={() => setLesson((l) => ({ ...l, isFreePreview: !l.isFreePreview }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${lesson.isFreePreview ? "bg-violet-600" : "bg-white/10"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${lesson.isFreePreview ? "left-6" : "left-1"}`} />
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-violet-300">ðŸ’¡ Tips</h3>
            <ul className="text-xs text-violet-300/70 space-y-2">
              <li>â€¢ Keep lesson titles clear and descriptive</li>
              <li>â€¢ Add videos for better engagement</li>
              <li>â€¢ Enable free preview for first lessons to attract students</li>
              <li>â€¢ Add text summaries alongside videos</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input ref={videoRef} type="file" accept="video/*" className="hidden" />
      <input ref={fileRef} type="file" className="hidden" />
    </div>
  );
};

export default CreateLesson;
