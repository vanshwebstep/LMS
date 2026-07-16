import { useEffect, useState } from "react";
import { Bell, Eye, EyeOff, Lock, Save, User } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { setUser as persistUser } from "../../utils/storage";
import { formatDateTime } from "../../utils/formatters";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function AccountSettings({ title = "Settings", subtitle = "Manage your account" }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div><h2 className="text-2xl font-bold text-gray-800">{title}</h2><p className="text-sm text-gray-500 mt-1">{subtitle}</p></div>
      <div className="flex gap-2 bg-white rounded-2xl shadow-sm p-1.5 w-fit">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === id ? "bg-indigo-600 text-white shadow" : "text-gray-500 hover:text-indigo-600"}`}><Icon size={16} /> {label}</button>)}</div>
      {activeTab === "profile" && <ProfileTab user={user} />}
      {activeTab === "security" && <SecurityTab />}
      {activeTab === "notifications" && <NotificationsTab />}
    </div>
  );
}

function ProfileTab({ user }) {
  const [form, setForm] = useState({ name: user?.name || "", title: user?.title || "", phone: user?.profile?.phone || "", city: user?.profile?.city || "", bio: user?.profile?.bio || "", expertise: user?.profile?.expertise || "", education: user?.profile?.education || "" });
  const [saving, setSaving] = useState(false);
  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const save = async () => { setSaving(true); try { const res = await api.put("/profile", { name: form.name, title: form.title, profile: { phone: form.phone, city: form.city, bio: form.bio, expertise: form.expertise, education: form.education } }); persistUser(res.user); toast.success("Profile updated"); } catch (err) { toast.error(err?.message || "Profile update failed"); } finally { setSaving(false); } };
  return <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5"><div className="flex items-center gap-4 border-b pb-5"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">{(form.name || "U")[0]}</div><div><p className="font-semibold text-gray-800">{form.name || user?.email}</p><p className="text-sm text-gray-500">{user?.email}</p><span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full mt-1 inline-block">{user?.role}</span></div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field label="Full Name" name="name" value={form.name} onChange={change} /><Field label="Title" name="title" value={form.title} onChange={change} /><Field label="Phone" name="phone" value={form.phone} onChange={change} /><Field label="City" name="city" value={form.city} onChange={change} /><Field label="Expertise" name="expertise" value={form.expertise} onChange={change} /><Field label="Education" name="education" value={form.education} onChange={change} /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Bio</label><textarea name="bio" value={form.bio} onChange={change} rows={3} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" /></div><div className="flex justify-end"><button onClick={save} disabled={saving} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"><Save size={16} /> {saving ? "Saving..." : "Save Changes"}</button></div></div>;
}

function SecurityTab() {
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const toggle = (key) => setShow((p) => ({ ...p, [key]: !p[key] }));
  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const submit = async () => { if (!form.oldPassword || !form.newPassword) return toast.error("Old and new password required"); if (form.newPassword !== form.confirmPassword) return toast.error("Confirm password does not match"); setSaving(true); try { await api.post("/auth/change-password", { oldPassword: form.oldPassword, newPassword: form.newPassword }); setForm({ oldPassword: "", newPassword: "", confirmPassword: "" }); toast.success("Password updated"); } catch (err) { toast.error(err?.message || "Password update failed"); } finally { setSaving(false); } };
  const fields = [{ label: "Current Password", key: "old", name: "oldPassword" }, { label: "New Password", key: "new", name: "newPassword" }, { label: "Confirm Password", key: "confirm", name: "confirmPassword" }];
  return <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5 max-w-md"><h3 className="font-semibold text-gray-700">Change Password</h3>{fields.map(({ label, key, name }) => <div key={key}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><div className="relative"><input name={name} value={form[name]} onChange={change} type={show[key] ? "text" : "password"} className="w-full border rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /><button type="button" onClick={() => toggle(key)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{show[key] ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>)}<button onClick={submit} disabled={saving} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"><Save size={16} /> {saving ? "Updating..." : "Update Password"}</button></div>;
}

function NotificationsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let alive = true; const load = async () => { try { const res = await api.get("/notifications"); if (alive) setItems(res.notifications || []); } catch (err) { toast.error(err?.message || "Notifications load failed"); } finally { if (alive) setLoading(false); } }; load(); return () => { alive = false; }; }, []);
  return <div className="bg-white rounded-2xl shadow-sm overflow-hidden"><div className="border-b px-5 py-4"><h3 className="font-semibold text-gray-800">Notifications</h3></div>{loading ? <p className="p-5 text-sm text-gray-500">Loading...</p> : items.length === 0 ? <p className="p-5 text-sm text-gray-500">No notifications yet</p> : <div className="divide-y">{items.map((item) => <div key={item.id} className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold text-gray-800">{item.title}</p><p className="mt-1 text-sm text-gray-500">{item.message}</p></div><span className="text-xs text-gray-400">{item.created_at ? formatDateTime(item.created_at) : ""}</span></div></div>)}</div>}</div>;
}

function Field({ label, ...props }) {
  return <label className="block"><span className="block text-sm font-medium text-gray-700 mb-1">{label}</span><input {...props} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></label>;
}