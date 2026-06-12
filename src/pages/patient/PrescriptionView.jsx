import React, { useEffect, useState } from 'react';
import { PrescriptionAPI } from '../../api/PrescriptionApi';
import { useParams } from 'react-router-dom';

const PrescriptionView = () => {
  const { appointmentId } = useParams();
  const [prescriptions, setPrescriptions] = useState(null);

  const getPrescription = async () => {
    try {
      const res = await PrescriptionAPI.getAll(3, 2);
      setPrescriptions(res.data.content);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPrescription();
  }, []);

  if (!prescriptions) return <p>Loading...</p>;

  return (
  <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
    <h2 className="text-xl font-bold mb-4">Prescription</h2>

    {prescriptions.length > 0 ? (
      prescriptions.map((prescription, index) => (
        <div key={index} className="mb-6 border-b pb-4">

          <p><b>Doctor:</b> {prescription.doctorName}</p>
          <p><b>Patient:</b> {prescription.patientName}</p>
          <p><b>Date:</b> {prescription.createdAt}</p>

          <h3 className="mt-4 font-semibold"x>Medicines</h3>
          <ul className="list-disc ml-5">
            {prescription.medicines?.map((m, i) => (
              <li key={i}>
                {m.name} - {m.dosage} - {m.duration}
              </li>
            ))}
          </ul>

          <p className="mt-4"><b>Notes:</b> {prescription.notes}</p>

        </div>
      ))
    ) : (
      <p>No prescriptions found.</p>
    )}
  </div>
);
};

export default PrescriptionView;