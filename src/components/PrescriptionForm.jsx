import React from "react";

const MEAL_TIMING_OPTIONS = [
  { value: "", label: "Select meal timing" },
  { value: "BEFORE_FOOD", label: "Before Food" },
  { value: "AFTER_FOOD", label: "After Food" },
  { value: "WITH_FOOD", label: "With Food" },
];

export default function   PrescriptionForm({
  form,
  setForm,
  onSubmit,
  loading,
  buttonText = "Submit",
}) {
  console.log("PrescriptionForm Rendered", form);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (index, e) => {
    const updated = [...form.medicines];
    updated[index][e.target.name] = e.target.value;
    setForm({ ...form, medicines: updated });
  };

  const addMedicine = () => {
    setForm({
      ...form,
      medicines: [
        ...form.medicines,
        {
          medicineName: "",
          dosage: "",
          frequency: "",
          days: "",
          mealTiming: "",
        },
      ],
    });
  };

  const removeMedicine = (index) => {
    const updated = form.medicines.filter((_, i) => i !== index);
    setForm({ ...form, medicines: updated });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Diagnosis</label>
          <input
            type="text"
            name="diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
            placeholder="Enter diagnosis"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Additional notes"
            rows={4}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Medicines</h3>
          <p className="text-sm text-slate-500">Add each medicine with dosage and days details.</p>
        </div>

        <button
          type="button"
          onClick={addMedicine}
          className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
        >
          + Add Medicine
        </button>
      </div>

      {form.medicines.map((med, index) => (
        <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <input name="medicineName" value={med.medicineName} onChange={(e)=>handleMedicineChange(index,e)} placeholder="Medicine name" className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/>
            <input name="dosage" value={med.dosage} onChange={(e)=>handleMedicineChange(index,e)} placeholder="Dosage" className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/>
            <input name="frequency" value={med.frequency} onChange={(e)=>handleMedicineChange(index,e)} placeholder="Frequency" className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/>          
            <input name="days" value={med.days} onChange={(e)=>handleMedicineChange(index,e)} placeholder="Days" className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"/>
            <select name="mealTiming" value={med.mealTiming} onChange={(e)=>handleMedicineChange(index,e)} className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
              {MEAL_TIMING_OPTIONS.map((option) => (
                <option key={option.value || 'placeholder'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => removeMedicine(index)}
            className="mt-3 text-sm font-medium text-red-500 transition hover:text-red-600"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving..." : buttonText}
      </button>
    </div>
  );
}