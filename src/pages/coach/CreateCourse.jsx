import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Upload, ChevronRight, Info } from "lucide-react";

const categories  = ["Web Development", "Backend", "Design", "Database", "Mobile", "Data Science", "DevOps"];
const difficulties = ["Beginner", "Intermediate", "Advanced"];
const languages    = ["Hindi", "English", "Hinglish"];

export default function CreateCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", category: "", difficulty: "Beginner",
    language: "Hindi", description: "", thumbnail: null,
    promoVideo: "", requirements: "", outcomes: "",
  });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((p) => ({ ...p, thumbnail: file }));
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = "Course title is required";
    if (!form.category)           e.category    = "Please select a category";
    if (!form.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: API call — save as draft & redirect to add lessons
    navigate("/coach/my-courses");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Create New Course</h2>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to create your course.</p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="text-indigo-600 font-medium">Basic Info</span>
        <ChevronRight size={14} />
        <span>Pricing Plans</span>
        <ChevronRight size={14} />
        <span>Lessons</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-500" /> Course Details
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={change}
              placeholder="e.g. React Masterclass 2025"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                errors.title ? "border-red-400" : ""
              }`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Category + Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={change}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                  errors.category ? "border-red-400" : ""
                }`}
              >
                <option value="">Select category</option>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={change}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {difficulties.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Language</label>
            <select
              name="language"
              value={form.language}
              onChange={change}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {languages.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              rows={4}
              placeholder="Describe what students will learn in this course..."
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none ${
                errors.description ? "border-red-400" : ""
              }`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Thumbnail */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <Upload size={18} className="text-indigo-500" /> Course Thumbnail
          </h3>
          <div className="flex items-start gap-4">
            <label className="flex-1 cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-indigo-400 transition-colors ${
                preview ? "border-indigo-400" : "border-gray-300"
              }`}>
                {preview ? (
                  <img src={preview} alt="preview" className="h-32 w-full object-cover rounded-lg" />
                ) : (
                  <div className="space-y-2">
                    <Upload size={32} className="mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload thumbnail</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 2MB • Recommended: 1280×720</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleThumb} />
            </label>
          </div>
        </div>

        {/* Requirements & Outcomes */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <Info size={18} className="text-indigo-500" /> Requirements & Outcomes
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={change}
              rows={3}
              placeholder="What should students know before taking this course? (one per line)"
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Learning Outcomes</label>
            <textarea
              name="outcomes"
              value={form.outcomes}
              onChange={change}
              rows={3}
              placeholder="What will students learn? (one per line)"
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-6">
          <button
            type="button"
            onClick={() => navigate("/coach/my-courses")}
            className="px-5 py-2.5 border rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition ml-auto"
          >
            Save & Continue <ChevronRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}