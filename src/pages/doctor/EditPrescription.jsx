import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PrescriptionAPI } from "../../api/PrescriptionAPI.js";
import PrescriptionForm from "../../components/PrescriptionForm.jsx";
import { toast } from "react-toastify";

export default function EditPrescription() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [form, setForm] = useState({
    diagnosis: "",
    notes: "",
    medicines: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await PrescriptionAPI.getappointmentprescription(id);
      const data = res.data;
      console.log("Fetched Data:", data);
      setPrescription(data);
      setForm({
        diagnosis: data.diagnosis,
        notes: data.notes,
        medicines: data.medicines,
      });
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log("Submitting Form:", form);
      await PrescriptionAPI.update(prescription.id, form);
      toast.success("Updated");    
    } catch {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2>Edit Prescription</h2>

      <PrescriptionForm
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Update"
      />
    </div>
  );
}