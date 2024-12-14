'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseclient';

export default function Inpu() {
  const [formData, setFormData] = useState({
    id: '',
    medicine_name: '',
    ingredients: '',
    pharmacy_name: '',
    address: '',
    availability: false
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission to insert data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure form data is valid
    if (!formData.id || !formData.medicine_name || !formData.ingredients || !formData.pharmacy_name || !formData.address) {
      setError('Please fill in all fields');
      return;
    }

    const { data: newData, error } = await supabase
      .from('main')
      .insert([formData]);

    if (error) {
      setError(`Error: ${error.message}`);
      setSuccessMessage('');
    } else {
      setSuccessMessage('Data added successfully!');
      setError('');

      // Reset form fields
      setFormData({ id: '', medicine_name: '', ingredients: '', pharmacy_name: '', address: '', availability: false });
    }
  };

  return (
    <div>
      <h1>Add Medicine</h1>

      {/* Display error message */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Display success message */}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {/* Form to insert data */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>ID:</label>
          <input
            type="number"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Medicine Name:</label>
          <input
            type="text"
            name="medicine_name"
            value={formData.medicine_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ingredients:</label>
          <input
            type="text"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Pharmacy Name:</label>
          <input
            type="text"
            name="pharmacy_name"
            value={formData.pharmacy_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Availability:</label>
          <input
            type="checkbox"
            name="availability"
            checked={formData.availability}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Medicine</button>
      </form>
    </div>
  );
}
