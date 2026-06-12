import React from "react";

export default function   PrescriptionForm({
  form,
  setForm,
  onSubmit,
  loading,
  buttonText = "Submit",
}) {
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
          duration: "",
          days: "",
        },
      ],
    });
  };

  const removeMedicine = (index) => {
    const updated = form.medicines.filter((_, i) => i !== index);
    setForm({ ...form, medicines: updated });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">

      {/* Diagnosis */}
      <input
        type="text"
        name="diagnosis"
        value={form.diagnosis}
        onChange={handleChange}
        placeholder="Diagnosis"
        className="w-full border px-3 py-2 rounded"
      />

      {/* Notes */}
      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Notes"
        className="w-full border px-3 py-2 rounded"
      />

      {/* Medicines */}
      <h3 className="font-medium">Medicines</h3>

      {form.medicines.map((med, index) => (
        <div key={index} className="border p-3 rounded bg-gray-50">
          <div className="grid grid-cols-2 gap-2">
            <input name="medicineName" value={med.medicineName} onChange={(e)=>handleMedicineChange(index,e)} placeholder="Name" className="border p-2 rounded"/>
            <input name="dosage" value={med.dosage} onChange={(e)=>handleMedicineChange(index,e)} placeholder="Dosage" className="border p-2 rounded"/>
            <input name="frequency" value={med.frequency} onChange={(e)=>handleMedicineChange(index,e)} placeholder="Frequency" className="border p-2 rounded"/>
            <input name="duration" value={med.duration} onChange={(e)=>handleMedicineChange(index,e)} placeholder="Duration" className="border p-2 rounded"/>
            <input name="days" value={med.days} onChange={(e)=>handleMedicineChange(index,e)} placeholder="Days" className="border p-2 rounded"/>
          </div>

          <button
            onClick={() => removeMedicine(index)}
            className="text-red-500 text-sm mt-1"
          >
            Remove
          </button>
        </div>
      ))}

      <button onClick={addMedicine} className="bg-gray-200 px-3 py-1 rounded">
        + Add Medicine
      </button>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : buttonText}
      </button>
    </div>
  );
}