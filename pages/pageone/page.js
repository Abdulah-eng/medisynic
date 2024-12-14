'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseclient';

export default function Outputone() {
  const [query, setQuery] = useState(''); // State to store user input
  const [data, setData] = useState([]); // State to store fetched data
  const [loading, setLoading] = useState(false); // State to handle loading state
  const [error, setError] = useState(null); // State to handle any errors

  // Handle search functionality
  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data: fetchedData, error } = await supabase
        .from('main')
        .select('*')
        .or(`medicine_name.ilike.%${query}%,ingredients.ilike.%${query}%`); // Match medicine_name or ingredients

      if (error) {
        setError(error.message);
      } else {
        setData(fetchedData || []); // Set the fetched data
      }
    } catch (e) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Medicine Records</h1>

      {/* Input and search button */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter medicine name or ingredient"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '300px' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px' }}>Search</button>
      </div>

      {/* Display error message */}
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {/* Display loading message */}
      {loading && <div>Loading...</div>}

      {/* Display results */}
      {!loading && data.length > 0 && (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Ingredients</th>
              <th>Pharmacy Name</th>
              <th>Address</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.medicine_name}</td>
                <td>{item.ingredients}</td>
                <td>{item.pharmacy_name}</td>
                <td>{item.address}</td>
                <td>{item.availability ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No results message */}
      {!loading && data.length === 0 && query.trim() && (
        <div>No records found for "{query}".</div>
      )}
    </div>
  );
}