'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseclient';

export default function Appointment() {
  const [formData, setFormData] = useState({
    patient_id: '',
    patient_name: '',
    doctor_id: '',
    doctor_name: '',
    start_time: '',
    end_time: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [doctorData, setDoctorData] = useState([]); // State to hold doctor details
  const [loadingDoctors, setLoadingDoctors] = useState(false); // State to manage doctor data loading

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission to insert data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure form data is valid
    if (
      !formData.patient_id ||
      !formData.patient_name ||
      !formData.doctor_id ||
      !formData.doctor_name ||
      !formData.start_time ||
      !formData.end_time
    ) {
      setError('Please fill in all fields');
      return;
    }

    const { data: newData, error } = await supabase
      .from('appointment')
      .insert([formData]);

    if (error) {
      setError(`Error: ${error.message}`);
      setSuccessMessage('');
    } else {
      setSuccessMessage('Appointment added successfully!');
      setError('');

      // Reset form fields
      setFormData({
        patient_id: '',
        patient_name: '',
        doctor_id: '',
        doctor_name: '',
        start_time: '',
        end_time: ''
      });
    }
  };

  // Fetch doctor details
  const handleFetchDoctors = async () => {
    setLoadingDoctors(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('doctor').select('*');
      if (error) {
        setError(`Error fetching doctor details: ${error.message}`);
      } else {
        setDoctorData(data || []);
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching doctor details.');
    } finally {
      setLoadingDoctors(false);
    }
  };

  return (
    <div>
      <h1>Add Appointment</h1>

      {/* Display error message */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Display success message */}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {/* Form to insert data */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>Patient ID:</label>
          <input
            type="number"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Patient Name:</label>
          <input
            type="text"
            name="patient_name"
            value={formData.patient_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Doctor ID:</label>
          <input
            type="number"
            name="doctor_id"
            value={formData.doctor_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Doctor Name:</label>
          <input
            type="text"
            name="doctor_name"
            value={formData.doctor_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="datetime-local"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Appointment</button>
      </form>

      {/* Doctors Detail Button */}
      <div>
        <button onClick={handleFetchDoctors} style={{ padding: '8px' }}>
          Doctors Detail
        </button>
      </div>

      {/* Display Doctor Details */}
      {loadingDoctors && <div>Loading doctor details...</div>}
      {!loadingDoctors && doctorData.length > 0 && (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Clinic Location</th>
              <th>Contact</th>
              <th>Specialization</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {doctorData.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.id}</td>
                <td>{doctor.name}</td>
                <td>{doctor.clinic_location}</td>
                <td>{doctor.contact}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loadingDoctors && doctorData.length === 0 && <div>No doctors found.</div>}
    </div>
  );
}
