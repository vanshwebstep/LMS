import { useState } from "react";
import { Plus, Edit2, Trash2, Check, Tag, Clock, Shield } from "lucide-react";

const mockPlans = [
  { id: 1, name: "Basic",    price: 499,  duration: 30,  features: ["All video lessons","Community access"],                            course: "React Masterclass", popular: false },
  { id: 2, name: "Pro",      price: 999,  duration: 90,  features: ["All video lessons","Assignments","1-on-1 Q&A","Certificate"],      course: "React Masterclass", popular: true  },
  { id: 3, name: "Premium",  price: 1999, duration: 180, features: ["Everything in Pro","Live sessions","Source code","Lifetime access"], course: "React Masterclass", popular: false },
];

const courseOptions = ["React Masterclass","Node.js Basics","CSS Advanced"];

export default function PricingPlans() {
  const [plans,      setPlans]      = useState(mockPlans);
  const [showModal,  setShowModal]  = useState(false);
  const [editPlan,   setEditPlan]   = useState(null);

  const openCreate = () => { setEditPlan(null); setShowModal(true); };
  const openEdit   = (p) => { setEditPlan(p);   setShowModal(true); };
  const deletePlan = (id) => setPlans((prev) => prev.filter((p) => p.id !== id));

  const savePlan = (data) => {
    if (editPlan) {
      setPlans((prev) => prev.map((p) => (p.id === editPlan.id ? { ...editPlan, ...data } : p)));
    } else {
      setPlans((prev) => [...prev, { ...data, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pricing Plans</h2>
          <p className="text-sm text-gray-500 mt-1">Create and manage subscription plans for your courses</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Add Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl shadow-sm overflow-hidden border-2 transition-shadow hover:shadow-md ${
              plan.popular ? "border-indigo-500" : "border-transparent"
            }`}
          >
            {plan.popular && (
              <div className="bg-indigo-600 text-white text-xs text-center py-1.5 font-semibold tracking-wide">
                ⭐ MOST POPULAR
              </div>
            )}
            <div className="p-5 space-y-4">
              {/* Plan Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{plan.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Tag size={11} /> {plan.course}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(plan)} className="p-1.5 hover:bg-indigo-50 rounded-lg">
                    <Edit2 size={14} className="text-indigo-500" />
                  </button>
                  <button onClick={() => deletePlan(plan.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div>
                <span className="text-3xl font-extrabold text-gray-800">₹{plan.price}</span>
                <span className="text-sm text-gray-500 ml-1 flex items-center gap-1 mt-0.5">
                  <Clock size={13} /> {plan.duration} days access
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={15} className="text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Status Badge */}
              <div className="pt-2 border-t flex items-center gap-1 text-xs text-green-600 font-medium">
                <Shield size={13} /> Active Plan
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <PlanModal
          plan={editPlan}
          courseOptions={courseOptions}
          onSave={savePlan}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

/* ─── Plan Modal ─────────────────────────────── */
function PlanModal({ plan, courseOptions, onSave, onClose }) {
  const [form, setForm] = useState({
    name:     plan?.name     || "",
    price:    plan?.price    || "",
    duration: plan?.duration || "",
    course:   plan?.course   || courseOptions[0],
    popular:  plan?.popular  || false,
    features: plan?.features?.join("\n") || "",
  });

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.duration) return;
    onSave({
      ...form,
      price:    Number(form.price),
      duration: Number(form.duration),
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">{plan ? "Edit Plan" : "Create Plan"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          {/* Course Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">For Course</label>
            <select name="course" value={form.course} onChange={change}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
              {courseOptions.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
              <input name="name" value={form.name} onChange={change} placeholder="e.g. Pro"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input name="price" type="number" value={form.price} onChange={change} placeholder="999"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
            <input name="duration" type="number" value={form.duration} onChange={change} placeholder="90"
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
            <textarea name="features" value={form.features} onChange={change} rows={4}
              placeholder={"Video lessons\nAssignments\nCertificate"}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="popular" checked={form.popular} onChange={change} className="w-4 h-4 accent-indigo-600" />
            <span className="text-sm text-gray-700">Mark as Most Popular</span>
          </label>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose}
            className="flex-1 border rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 transition">
            {plan ? "Update Plan" : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}