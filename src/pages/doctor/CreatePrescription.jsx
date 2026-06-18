import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PrescriptionAPI } from "../../api/PrescriptionAPI.js";
import PrescriptionForm from "../../components/PrescriptionForm.jsx";
import { toast } from "react-toastify";
import { formatDate, formatDisplayDate, formatTime } from "../../utils/helper.js";

export default function CreatePrescription() {
  const { state } = useLocation();
  const navigate = useNavigate();
  console.log("Received State:", state);

  const {
    appointmentId,
    patientId,
    doctorId,
    appointmentDate,
    startTime,
    endTime,
    patientName,
    doctorName,
    reason,
  } = state || {};

  const [loading, setLoading] = useState(false);

  const today = formatDate(new Date());

  const [form, setForm] = useState({
    diagnosis: "",
    notes: "",
    medicines: [
      { medicineName: "", dosage: "", frequency: "", duration: "", days: "" ,mealTiming: ""},
    ],
  });

  // Persist prescription draft to localStorage (keyed by appointment or patient)
  const draftKey = `prescription_draft_${appointmentId || patientId || 'new'}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch (err) {
      console.error('load draft failed', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(form));
      } catch (err) {
        console.error('save draft failed', err);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [form, draftKey]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        appointmentId,
        patientId,
        doctorId,
        prescriptionDate: today,
        endDate: today,
        appointmentDate: formatDate(appointmentDate),
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        ...form,
      };

      await PrescriptionAPI.create(payload);

      toast.success("Created");
      try { localStorage.removeItem(draftKey); } catch {}
      navigate("/doctor/dashboard");
    } catch {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-8 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
            Doctor Workspace
          </p>
          <h2 className="mt-2 text-3xl font-bold">Create Prescription</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-200">
            Review the appointment, keep all dates in standard format, and create the prescription in one clean step.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <InfoChip label="Prescription Date" value={formatDisplayDate(today)} />
            <InfoChip label="Appointment Date" value={formatDisplayDate(appointmentDate)} />
            <InfoChip label="Time" value={`${formatTime(startTime)} – ${formatTime(endTime)}`} />
            <InfoChip label="Patient" value={patientName || patientId || "N/A"} />
            <InfoChip label="Doctor" value={doctorName || doctorId || "N/A"} />
            <InfoChip label="Reason" value={reason || "N/A"} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <PrescriptionForm
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            loading={loading}
            buttonText="Create Prescription"
          />
        </div>
      </div>
    </div>
  );
}

function InfoChip({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.16em] text-blue-100">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}