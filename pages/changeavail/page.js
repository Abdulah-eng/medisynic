'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseclient';

export default function SearchByPharmacy() {
  const [query, setQuery] = useState(''); // State to store user input
  const [data, setData] = useState([]); // State to store fetched data
  const [loading, setLoading] = useState(false); // State to handle loading state
  const [error, setError] = useState(null); // State to handle any errors
  const [changes, setChanges] = useState({}); // To store changed availability data

  // Handle search functionality
  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a pharmacy name');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data: fetchedData, error } = await supabase
        .from('main')
        .select('id, medicine_name, ingredients, address, availability')
        .ilike('pharmacy_name', `%${query}%`); // Match pharmacy_name

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

  // Handle availability change
  const handleAvailabilityChange = (id, newAvailability) => {
    setChanges((prevChanges) => ({
      ...prevChanges,
      [id]: newAvailability,
    }));
  };

  // Commit changes to the database
  const handleCommitChanges = async () => {
    setLoading(true);
    setError(null);
    try {
      // Loop over changed availability and update the database
      for (const [id, availability] of Object.entries(changes)) {
        const { error } = await supabase
          .from('main')
          .update({ availability })
          .eq('id', id); // Update availability where id matches

        if (error) {
          setError(`Failed to update availability for ID ${id}`);
          break;
        }
      }

      // If no errors, reset changes and refetch data
      setChanges({});
      handleSearch();
    } catch (e) {
      setError('An unexpected error occurred while committing changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Medicines by Pharmacy</h1>

      {/* Input and search button */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter pharmacy name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '300px' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px' }}>
          Search
        </button>
      </div>

      {/* Display error message */}
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {/* Display loading message */}
      {loading && <div>Loading...</div>}

      {/* Display results */}
      {!loading && data.length > 0 && (
        <>
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Ingredients</th>
                <th>Address</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.medicine_name}</td>
                  <td>{item.ingredients}</td>
                  <td>{item.address}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={changes[item.id] ?? item.availability}
                      onChange={(e) =>
                        handleAvailabilityChange(item.id, e.target.checked)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Commit button */}
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleCommitChanges} style={{ padding: '8px' }}>
              Commit Changes
            </button>
          </div>
        </>
      )}

      {/* No results message */}
      {!loading && data.length === 0 && query.trim() && (
        <div>No records found for pharmacy "{query}".</div>
      )}
    </div>
  );
}
