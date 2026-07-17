import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, ChevronRight, Info, Upload } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { resolveMediaUrl } from "../../utils/media";

const categories = ["Web Development", "Backend", "Design", "Database", "Mobile", "Data Science", "DevOps"];
const difficulties = ["Beginner", "Intermediate", "Advanced"];
const languages = ["Hindi", "English", "Hinglish"];

const initialForm = {
  title: "",
  category: "",
  difficulty: "Beginner",
  language: "Hinglish",
  description: "",
  price: "999",
  status: "published",
  thumbnail: null,
  promoVideo: "",
  requirements: "",
  outcomes: "",
};

export default function CreateCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoadingCourse(true);
    api.get(`/coach/courses/${id}`).then((res) => {
      if (!alive) return;
      const course = res.course || {};
      setForm({
        ...initialForm,
        title: course.title || "",
        category: course.category || "",
        difficulty: course.difficulty || "Beginner",
        language: course.language || "Hinglish",
        description: course.description || "",
        price: String(course.price ?? "999"),
        status: course.status || "published",
        promoVideo: course.promoVideo || "",
        requirements: (course.requirements || []).join("\n"),
        outcomes: (course.outcomes || []).join("\n"),
      });
      setPreview(resolveMediaUrl(course.thumbnailUrl) || null);
    }).catch((err) => {
      toast.error(err?.message || "Failed to load course");
      navigate("/coach/my-courses");
    }).finally(() => { if (alive) setLoadingCourse(false); });
    return () => { alive = false; };
  }, [id, navigate]);

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

  const uploadThumbnail = async () => {
    if (!form.thumbnail) return "";
    const data = new FormData();
    data.append("file", form.thumbnail);
    const res = await api.post("/upload/image", data, { headers: { "Content-Type": "multipart/form-data" } });
    return res.upload?.url || res.material?.url || "";
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Course title is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.description.trim()) e.description = "Description is required";
    if (Number(form.price) < 0) e.price = "Price cannot be negative";
    if (form.thumbnail && !form.thumbnail.type?.startsWith("image/")) e.thumbnail = "Please select a valid image file";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const uploadedThumbnailUrl = await uploadThumbnail();
      const payload = {
        title: form.title,
        category: form.category,
        difficulty: form.difficulty,
        language: form.language,
        description: form.description,
        price: Number(form.price || 0),
        status: form.status,
        promoVideo: form.promoVideo,
        requirements: form.requirements,
        outcomes: form.outcomes,
        ...(uploadedThumbnailUrl ? { thumbnailUrl: uploadedThumbnailUrl } : {}),
      };
      if (editing) await api.put(`/coach/courses/${id}`, payload);
      else await api.post("/coach/courses", payload);
      toast.success(editing ? "Course updated" : "Course created");
      navigate("/coach/my-courses");
    } catch (err) {
      toast.error(err?.message || (editing ? "Failed to update course" : "Failed to create course"));
    } finally {
      setSaving(false);
    }
  };

  if (loadingCourse) return <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-sm">Loading course...</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{editing ? "Edit Course" : "Create New Course"}</h2>
        <p className="mt-1 text-sm text-gray-500">{editing ? "Update course details and publishing settings." : "Fill in the details below to create your course."}</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500"><span className="font-medium text-indigo-600">Basic Info</span><ChevronRight size={14} /><span>Pricing</span><ChevronRight size={14} /><span>Publish</span></div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-700"><BookOpen size={18} className="text-indigo-500" /> Course Details</h3>
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Course Title <span className="text-red-500">*</span></label><input name="title" value={form.title} onChange={change} placeholder="e.g. React Masterclass 2026" className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.title ? "border-red-400" : ""}`} />{errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}</div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label><select name="category" value={form.category} onChange={change} className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.category ? "border-red-400" : ""}`}><option value="">Select category</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>{errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}</div>
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Difficulty Level</label><select name="difficulty" value={form.difficulty} onChange={change} className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">{difficulties.map((d) => <option key={d}>{d}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Language</label><select name="language" value={form.language} onChange={change} className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">{languages.map((l) => <option key={l}>{l}</option>)}</select></div>
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Price</label><input name="price" type="number" value={form.price} onChange={change} className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}</div>
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Status</label><select name="status" value={form.status} onChange={change} className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"><option value="published">Published</option><option value="draft">Draft</option></select></div>
          </div>
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label><textarea name="description" value={form.description} onChange={change} rows={4} placeholder="Describe what students will learn in this course..." className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.description ? "border-red-400" : ""}`} />{errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}</div>
        </div>
        <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-700"><Upload size={18} className="text-indigo-500" /> Course Thumbnail</h3>
          <label className="block cursor-pointer">
            <div className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors hover:border-indigo-400 ${preview ? "border-indigo-400" : "border-gray-300"}`}>
              {preview ? <img src={preview} alt="Course thumbnail preview" className="h-40 w-full rounded-lg object-cover" /> : <div className="space-y-2"><Upload size={32} className="mx-auto text-gray-400" /><p className="text-sm text-gray-500">Click to upload thumbnail</p><p className="text-xs text-gray-400">Image will be saved with this course</p></div>}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleThumb} />
          </label>
          {errors.thumbnail && <p className="text-xs text-red-500">{errors.thumbnail}</p>}
        </div>
        <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-gray-700"><Info size={18} className="text-indigo-500" /> Requirements & Outcomes</h3>
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Requirements</label><textarea name="requirements" value={form.requirements} onChange={change} rows={3} placeholder="One per line" className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div>
          <div><label className="mb-1 block text-sm font-medium text-gray-700">Learning Outcomes</label><textarea name="outcomes" value={form.outcomes} onChange={change} rows={3} placeholder="One per line" className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div>
        </div>
        <div className="flex items-center gap-3 pb-6"><button type="button" onClick={() => navigate("/coach/my-courses")} className="rounded-xl border px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Cancel</button><button type="submit" disabled={saving} className="ml-auto flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60">{saving ? (form.thumbnail ? "Uploading..." : "Saving...") : editing ? "Update Course" : "Save Course"} <ChevronRight size={16} /></button></div>
      </form>
    </div>
  );
}