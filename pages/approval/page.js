'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseclient';

export default function AppointmentStatus() {
  const [formData, setFormData] = useState({
    patient_id: '',
    patient_name: ''
  });
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Check appointment status
  const handleCheckStatus = async () => {
    const { patient_id, patient_name } = formData;

    if (!patient_id || !patient_name) {
      setError('Please enter both Patient ID and Patient Name');
      return;
    }

    setLoading(true);
    setError(null);
    setAppointmentStatus('');
    try {
      const { data, error } = await supabase
        .from('appointment')
        .select('doctor_name, confirm')
        .eq('patient_id', patient_id)
        .eq('patient_name', patient_name);

      if (error || !data || data.length === 0) {
        setError('No appointments found for the given Patient ID and Name.');
      } else {
        // Format the appointment statuses
        const statuses = data.map((appointment) => {
          const { doctor_name, confirm } = appointment;
          return confirm
            ? `Your appointment with Doctor ${doctor_name} is accepted.`
            : `Your appointment with Doctor ${doctor_name} is not yet accepted.`;
        });

        setAppointmentStatus(statuses.join('\n')); // Combine all statuses into a single string
      }
    } catch (err) {
      setError('An unexpected error occurred while checking the appointment status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Check Appointment Status</h1>

      {/* Display error message */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Display appointment status */}
      {appointmentStatus && <div style={{ whiteSpace: 'pre-wrap', color: 'green' }}>{appointmentStatus}</div>}

      {/* Input form */}
      <div style={{ marginBottom: '20px' }}>
        <label>Patient ID:</label>
        <input
          type="number"
          name="patient_id"
          value={formData.patient_id}
          onChange={handleChange}
          placeholder="Enter Patient ID"
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Patient Name:</label>
        <input
          type="text"
          name="patient_name"
          value={formData.patient_name}
          onChange={handleChange}
          placeholder="Enter Patient Name"
        />
      </div>
      <button onClick={handleCheckStatus} style={{ padding: '8px' }} disabled={loading}>
        {loading ? 'Checking...' : 'Check Status'}
      </button>

      {/* Display loading message */}
      {loading && <div>Checking appointment status...</div>}
    </div>
  );
}
