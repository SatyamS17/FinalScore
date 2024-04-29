import React, { useState, useEffect } from 'react';
import Navbar from './navbar';

export default function Home() {
  const [refData, setRefData] = useState([]);

// Fetch players for dropdown
useEffect(() => {
  const fetchRefData = async () => {
    const response = await fetch('/api/referee-stats', { cache: 'no-store' });

      const data = await response.json();

      if (data.error) {
          console.error('Error fetching referees:', data.error);
      } else {
        setRefData(data); 
      }
  };
  fetchRefData();
}, []);


  return (
    <>
      <Navbar />
      <div className='container mx-auto items-center justify-center flex mt-32'>
        <h1 className="text-5xl">Welcome to <span className="inline-block bg-gradient-to-r from-blue-500 to-orange-400 text-transparent bg-clip-text font-bold">Final Score!</span></h1>
      </div>
      
      <div>
        {refData.map((stat) => (
          <div key={stat.name}>
            <h2>Name: {stat.name}</h2>
            <p>AVG attendance: { stat.avg_attendance} MAX attendance:{ stat.max_attendance}</p>
          </div>
        ))}
      </div>
    </>
  );
}
