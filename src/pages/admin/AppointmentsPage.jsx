import React, { useEffect, useState } from "react";
import { AppointmentAPI } from "../../api/AppointmentApi";
import { DoctorAPI } from "../../api/DoctorApi";
import { PatientAPI } from "../../api/PatientApi";
import { PrescriptionAPI } from "../../api/PrescriptionApi";
import { toast } from "react-toastify";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");

  const [doctorId, setDoctorId] = useState(null);
  const [patientId, setPatientId] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  // 🔥 Prescription State
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // ---------------------------
  // Fetch Appointments
  // ---------------------------
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await AppointmentAPI.getAll(
        doctorId,
        patientId,
        startDate || null,
        endDate || null,
        appointmentStatus || null,
        page,
        size
      );

      const data = res.data?.data || res.data;

      setAppointments(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Fetch Doctors
  // ---------------------------
  const fetchDoctors = async (name) => {
    try {
      const res = await DoctorAPI.getDoctors(name);
      const data = res.data?.data || res.data;
      setDoctors(data.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------
  // Fetch Patients
  // ---------------------------
  const fetchPatients = async (name) => {
    try {
      const res = await PatientAPI.getPatients(name);
      const data = res.data?.data || res.data;
      setPatients(data.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, startDate, endDate, appointmentStatus, doctorId, patientId]);

  // ---------------------------
  // 🔥 VIEW PRESCRIPTION INLINE
  // ---------------------------
  const handleViewPrescription = async (appt) => {
    try {
      // toggle (close if same clicked)
      if (selectedAppointmentId === appt.id) {
        setSelectedPrescription(null);
        setSelectedAppointmentId(null);
        return;
      }
      
      const res =
        await PrescriptionAPI.getappointmentprescription(appt.id);
      console.log("Prescription:", res.data);
      const data = res.data?.data || res.data;

      if (!data) {
        toast.error("No prescription found");
        return;
      }

      setSelectedPrescription(data);
      setSelectedAppointmentId(appt.id);

    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch prescription");
    }
  };

  const AllStatuses = ["CONFIRMED", "COMPLETED", "CANCELLED"];

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Appointments</h2>

      {/* Doctor Search */}
      <input
        type="text"
        placeholder="Search doctor..."
        value={doctorName || ""}
        onChange={(e) => {
          setDoctorName(e.target.value);
          fetchDoctors(e.target.value);
        }}
        className="border p-2 w-full mb-2"
      />

      {doctors.length > 0 && (
        <div className="border bg-white mb-4">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => {
                setDoctorId(doc.id);
                setDoctorName(doc.doctorName || "");
                setDoctors([]);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {doc.doctorName} ({doc.specialization})
            </div>
          ))}
        </div>
      )}

      {/* Patient Search */}
      <input
        type="text"
        placeholder="Search patient..."
        value={patientName || ""}
        onChange={(e) => {
          setPatientName(e.target.value);
          fetchPatients(e.target.value);
        }}
        className="border p-2 w-full mb-2"
      />

      {patients.length > 0 && (
        <div className="border bg-white mb-4">
          {patients.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setPatientId(p.id);
                setPatientName(p.name || "");
                setPatients([]);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {p.name}
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded">
        {loading ? (
          <p className="p-6 text-center">Loading...</p>
        ) : (
          <table className="w-full text-center">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="border-t">
                  <td>{appt.id}</td>
                  <td>{appt.date}</td>
                  <td>{appt.startTime} - {appt.endTime}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded ${getStatusStyle(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td>{appt.doctorName}</td>
                  <td>{appt.patientName}</td>

                  <td>
                    <button
                      onClick={() => handleViewPrescription(appt)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      {selectedAppointmentId === appt.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔥 PRESCRIPTION DISPLAY */}
      {selectedPrescription && (
        <div className="mt-6 bg-white p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-4">
            Prescription (Appointment ID: {selectedAppointmentId})
          </h3>

          <p><strong>Doctor:</strong> {selectedPrescription.doctorName}</p>
          <p><strong>Patient:</strong> {selectedPrescription.patientName}</p>
          <p><strong>Diagnosis:</strong> {selectedPrescription.diagnosis}</p>
          <p><strong>Notes:</strong> {selectedPrescription.notes}</p>

          <h4 className="mt-4 font-semibold">Medicines</h4>

          {selectedPrescription.medicines?.length > 0 ? (
            <table className="w-full mt-2 border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th>Name</th>
                  <th>Dosage</th>
                  <th>Duration</th>
                  <th>Frequency</th>
                </tr>
              </thead>
              <tbody>
                {selectedPrescription.medicines.map((med, i) => (
                  <tr key={i} className="border-t text-center">
                    <td>{med.medicineName}</td>
                    <td>{med.dosage}</td>
                    <td>{med.days}</td>
                    <td>{med.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No medicines</p>
          )}
        </div>
      )}
    </div>
  );
}