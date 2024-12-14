'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseclient';

export default function Output() {
  const [data, setData] = useState([]); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle any errors

  useEffect(() => {
    const fetchData = async () => {
      const { data: fetchedData, error } = await supabase
        .from('main') // The name of the table
        .select('*'); // Select all columns

      if (error) {
        setError(error.message); // Handle error
      } else {
        setData(fetchedData || []); // Set the fetched data
      }
      setLoading(false); // Stop loading
    };

    fetchData(); // Call the fetch function on component mount
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading message while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Display any error message
  }

  return (
    <div>
      <h1>Medicine Records</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
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
              <td>{item.id}</td>
              <td>{item.medicine_name}</td>
              <td>{item.ingredients}</td>
              <td>{item.pharmacy_name}</td>
              <td>{item.address}</td>
              <td>{item.availability ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
