import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PrescriptionAPI } from "../../api/PrescriptionAPI";
import PrescriptionForm from "../../components/PrescriptionForm";
import { toast } from "react-toastify";

export default function CreatePrescription() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { appointmentId, patientId , doctorId} = state || {};

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    diagnosis: "",
    notes: "",
    medicines: [
      { medicineName: "", dosage: "", frequency: "", duration: "", days: "" },
    ],
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await PrescriptionAPI.create({
        appointmentId,
        patientId,
        doctorId,
        ...form,
      });

      toast.success("Created");
      navigate("/doctor/appointments");
    } catch {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2>Create Prescription</h2>

      <PrescriptionForm
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Create"
      />
    </div>
  );
}