import { useState } from "react";
import { User, Lock, Bell, Camera, Save, Eye, EyeOff } from "lucide-react";

const tabs = [
  { id: "profile",  label: "Profile",       icon: User },
  { id: "security", label: "Security",      icon: Lock },
  { id: "notif",    label: "Notifications", icon: Bell },
];

export default function CoachSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your profile and preferences</p>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-2 bg-white rounded-2xl shadow-sm p-1.5 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === id
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-500 hover:text-indigo-600"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {activeTab === "profile"  && <ProfileTab />}
      {activeTab === "security" && <SecurityTab />}
      {activeTab === "notif"    && <NotifTab />}
    </div>
  );
}

/* ─── Profile Tab ─────────────────────────────────── */
function ProfileTab() {
  const [form, setForm] = useState({
    name: "Rajesh Kumar", email: "rajesh@coach.com",
    phone: "9876543210", bio: "Full-stack developer with 5+ years experience.",
    expertise: "Web Development", website: "",
  });

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
            {form.name[0]}
          </div>
          <label className="absolute bottom-0 right-0 bg-white border rounded-full p-1.5 cursor-pointer shadow hover:bg-gray-50">
            <Camera size={14} className="text-gray-600" />
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{form.name}</p>
          <p className="text-sm text-gray-500">{form.email}</p>
          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full mt-1 inline-block">Coach</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name"  name="name"      value={form.name}      onChange={change} />
        <Field label="Email"      name="email"     value={form.email}     onChange={change} type="email" />
        <Field label="Phone"      name="phone"     value={form.phone}     onChange={change} type="tel" />
        <Field label="Expertise"  name="expertise" value={form.expertise} onChange={change} />
        <Field label="Website"    name="website"   value={form.website}   onChange={change} placeholder="https://yoursite.com" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          name="bio" value={form.bio} onChange={change} rows={3}
          className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
        />
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  );
}

/* ─── Security Tab ────────────────────────────────── */
function SecurityTab() {
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const toggle = (k) => setShow((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5 max-w-md">
      <h3 className="font-semibold text-gray-700">Change Password</h3>
      {[
        { label: "Current Password",  key: "old" },
        { label: "New Password",      key: "new" },
        { label: "Confirm Password",  key: "confirm" },
      ].map(({ label, key }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <div className="relative">
            <input
              type={show[key] ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="••••••••"
            />
            <button onClick={() => toggle(key)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      ))}
      <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
        <Save size={16} /> Update Password
      </button>
    </div>
  );
}

/* ─── Notifications Tab ───────────────────────────── */
function NotifTab() {
  const [prefs, setPrefs] = useState({
    newEnrollment: true, assignmentSubmit: true,
    paymentReceived: true, weeklyReport: false,
  });
  const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const items = [
    { key: "newEnrollment",    label: "New Student Enrollment",  desc: "When a student buys your course" },
    { key: "assignmentSubmit", label: "Assignment Submitted",    desc: "When a student submits an assignment" },
    { key: "paymentReceived",  label: "Payment Received",        desc: "When a payment is confirmed" },
    { key: "weeklyReport",     label: "Weekly Report",           desc: "Summary of weekly performance" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h3 className="font-semibold text-gray-700">Notification Preferences</h3>
      {items.map(({ key, label, desc }) => (
        <div key={key} className="flex items-center justify-between py-3 border-b last:border-0">
          <div>
            <p className="text-sm font-medium text-gray-800">{label}</p>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
          <button
            onClick={() => toggle(key)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              prefs[key] ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              prefs[key] ? "translate-x-5" : "translate-x-0"
            }`} />
          </button>
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
          <Save size={16} /> Save Preferences
        </button>
      </div>
    </div>
  );
}

/* ─── Reusable Field ──────────────────────────────── */
function Field({ label, name, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type} name={name} value={value}
        onChange={onChange} placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
  );
}