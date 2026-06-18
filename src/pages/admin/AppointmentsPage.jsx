import React, { useEffect, useState } from "react";
import { AppointmentAPI } from "../../api/AppointmentApi";
import { DoctorAPI } from "../../api/DoctorApi";
import { PatientAPI } from "../../api/PatientApi";
import { PrescriptionAPI } from "../../api/PrescriptionApi";
import { toast } from "react-toastify";
import { formatTime, formatDisplayDate } from "../../utils/helper";
import DatePicker from "../../components/DatePicker";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [doctorId, setDoctorId] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // ---------------- FETCH ----------------
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await AppointmentAPI.getAll(
        doctorId,
        patientId,
        startDate || null,
        endDate || null,
        status || null,
        page,
        size
      );

      const data = res.data?.data || res.data;
      setAppointments(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch {
      toast.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, doctorId, patientId, startDate, endDate, status]);

  // ---------------- SEARCH ----------------
  const fetchDoctors = async (name) => {
    const res = await DoctorAPI.getDoctors(name);
    setDoctors(res.data?.data?.content || []);
  };

  const fetchPatients = async (name) => {
    const res = await PatientAPI.getPatients(name);
    setPatients(res.data?.data?.content || []);
  };

  // ---------------- PRESCRIPTION ----------------
  const handleViewPrescription = async (appt) => {
    if (selectedAppointmentId === appt.id) {
      setSelectedPrescription(null);
      setSelectedAppointmentId(null);
      return;
    }

    try {
      const res = await PrescriptionAPI.getappointmentprescription(appt.id);
      setSelectedPrescription(res.data?.data || res.data);
      setSelectedAppointmentId(appt.id);
    } catch {
      toast.error("No prescription");
    }
  };

  // ---------------- STYLE ----------------
  const getStatusStyle = (s) => {
    if (s === "CONFIRMED") return "bg-green-500 text-white";
    if (s === "COMPLETED") return "bg-blue-500 text-white";
    if (s === "CANCELLED") return "bg-red-500 text-white";
    return "bg-gray-400 text-white";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-xl font-semibold mb-6">Appointments</h2>

      {/* 🔍 FILTERS */}
      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Filter appointments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Doctor</label>
            <input
              type="text"
              placeholder="Search doctor..."
              value={doctorName}
              onChange={(e) => {
                setDoctorName(e.target.value);
                fetchDoctors(e.target.value);
              }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Patient</label>
            <input
              type="text"
              placeholder="Search patient..."
              value={patientName}
              onChange={(e) => {
                setPatientName(e.target.value);
                fetchPatients(e.target.value);
              }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm bg-white"
            />
          </div>

          <DatePicker
            label="From"
            value={startDate}
            onChange={setStartDate}
          />

          <DatePicker
            label="To"
            value={endDate}
            onChange={setEndDate}
            minDate={startDate}
          />

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 rounded-xl shadow-sm bg-white"
            >
              <option value="">All</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setDoctorId(null);
                setPatientId(null);
                setDoctorName("");
                setPatientName("");
                setStartDate("");
                setEndDate("");
                setStatus("");
              }}
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* 📊 TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              {["ID","Date","Time","Status","Doctor","Patient","Action"].map(h=>(
                <th key={h} className="px-6 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-6">Loading...</td></tr>
            ) : appointments.map(appt=>(
              <React.Fragment key={appt.id}>

                <tr className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{appt.id}</td>
                  <td className="px-6 py-4">{formatDisplayDate(appt.date)}</td>
                  <td className="px-6 py-4">
                    {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded ${getStatusStyle(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{appt.doctorName}</td>
                  <td className="px-6 py-4">{appt.patientName}</td>

                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={()=>handleViewPrescription(appt)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      {selectedAppointmentId === appt.id ? "Hide" : "View"}
                    </button>                    
                  </td>
                </tr>

                {/* Prescription */}
                {selectedAppointmentId === appt.id && selectedPrescription && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50 p-5">
                      <div className="bg-white p-4 rounded shadow">

                        <p><b>Diagnosis:</b> {selectedPrescription.diagnosis}</p>
                        <p><b>Notes:</b> {selectedPrescription.notes}</p>

                        <table className="w-full mt-3 text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th>Name</th>
                              <th>Dosage</th>
                              <th>Days</th>
                              <th>Freq</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedPrescription.medicines?.map((m,i)=>(
                              <tr key={i} className="border-t text-center">
                                <td>{m.medicineName}</td>
                                <td>{m.dosage}</td>
                                <td>{m.days}</td>
                                <td>{m.frequency}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                      </div>
                    </td>
                  </tr>
                )}

              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between mt-5">
        <button onClick={()=>setPage(p=>p-1)} disabled={page===0} className="px-4 py-2 bg-gray-200 rounded">Prev</button>
        <span>{page+1} / {totalPages}</span>
        <button onClick={()=>setPage(p=>p+1)} disabled={page+1>=totalPages} className="px-4 py-2 bg-gray-200 rounded">Next</button>
      </div>

    </div>
  );
}