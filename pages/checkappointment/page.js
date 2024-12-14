'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseclient';

export default function CheckAppointment() {
  const [doctorId, setDoctorId] = useState('');
  const [appointments, setAppointments] = useState([]); // State to hold fetched appointments
  const [loading, setLoading] = useState(false); // Loading state for fetching appointments
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes for doctor ID
  const handleDoctorIdChange = (e) => {
    setDoctorId(e.target.value);
  };

  // Fetch appointments for a specific doctor
  const handleFetchAppointments = async () => {
    if (!doctorId) {
      setError('Please enter a Doctor ID');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('appointment')
        .select('*')
        .eq('doctor_id', doctorId); // Fetch appointments for the given doctor_id

      if (error) {
        setError(`Error fetching appointments: ${error.message}`);
      } else {
        setAppointments(data || []);
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching appointments.');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for appointment data
  const handleAppointmentChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const updatedAppointments = [...appointments];
    updatedAppointments[index] = {
      ...updatedAppointments[index],
      [name]: type === 'checkbox' ? checked : value
    };
    setAppointments(updatedAppointments);
  };

  // Commit changes to the database
  const handleCommitChanges = async () => {
    setLoading(true);
    setError(null);
    try {
      const updates = appointments.map((appointment) => ({
        id: appointment.id,
        confirm: appointment.confirm
      }));

      // Update each appointment in the database
      const { error } = await supabase
        .from('appointment')
        .upsert(updates, { onConflict: ['id'] }); // Upsert to update existing records or insert new ones

      if (error) {
        setError(`Error committing changes: ${error.message}`);
      } else {
        setSuccessMessage('Changes committed successfully!');
      }
    } catch (err) {
      setError('An unexpected error occurred while committing changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Check and Update Appointments</h1>

      {/* Display error message */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Display success message */}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {/* Input for Doctor ID */}
      <div>
        <label>Doctor ID:</label>
        <input
          type="number"
          value={doctorId}
          onChange={handleDoctorIdChange}
          placeholder="Enter Doctor ID"
        />
        <button onClick={handleFetchAppointments} style={{ padding: '8px', marginLeft: '10px' }}>
          Fetch Appointments
        </button>
      </div>

      {/* Display appointments table */}
      {loading && <div>Loading appointments...</div>}

      {!loading && appointments.length > 0 && (
        <div>
          <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Confirm</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.patient_name}</td>
                  <td>{appointment.start_time}</td>
                  <td>{appointment.end_time}</td>
                  <td>
                    <input
                      type="checkbox"
                      name="confirm"
                      checked={appointment.confirm}
                      onChange={(e) => handleAppointmentChange(e, index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Commit Changes Button */}
          <div>
            <button onClick={handleCommitChanges} style={{ padding: '8px', marginTop: '10px' }}>
              Commit Changes
            </button>
          </div>
        </div>
      )}

      {!loading && appointments.length === 0 && <div>No appointments found for this doctor.</div>}
    </div>
  );
}
