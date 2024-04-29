import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import { parseSetCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export default function Home() {
  const [funFactData, setFactData] = useState([]);

// Get the right query based on the selection
async function handleFunFact(queryNumber) {
        
  const response = await fetch(`/api/referee-stats?queryNumber=${queryNumber}`);
  const data = await response.json();
  
  if (data.error) {
    console.error('Error fetching referees:', data.error);
  } else {
    setFactData(data); 
    if(queryNumber == 1) {
      // make first one visible
      const first = document.getElementById('attendance'); 
      first.classList.remove('hidden');

      const second = document.getElementById('foulmaster'); 
      second.classList.add('hidden');

      const third = document.getElementById('disadvantagedking'); 
      third.classList.add('hidden');
    }
    else if (queryNumber == 2) {
      // make second one visible
      const first = document.getElementById('attendance'); 
      first.classList.add('hidden');

      const second = document.getElementById('foulmaster'); 
      second.classList.remove('hidden');

      const third = document.getElementById('disadvantagedking'); 
      third.classList.add('hidden');

    }
    else if (queryNumber == 3) {
      // make third one visible
      const first = document.getElementById('attendance'); 
      first.classList.add('hidden');

      const second = document.getElementById('foulmaster'); 
      second.classList.add('hidden');

      const third = document.getElementById('disadvantagedking'); 
      third.classList.remove('hidden');

    }
    else {
      // make sure all are hidden
      const first = document.getElementById('attendance'); 
      first.classList.add('hidden');

      const second = document.getElementById('foulmaster'); 
      second.classList.add('hidden');

      const third = document.getElementById('disadvantagedking'); 
      third.classList.add('hidden');
    }
  }
};

  return (
    <>
      <Navbar />

      <div class="mt-10 relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-50 before:z-10">
      <img src="https://wallpapers.com/images/hd/lebron-james-basketball-jersey-23-bmdglwh69rqk6o3h.jpg" alt="Banner Image" class="absolute inset-0 w-full h-full object-cover object-top" />
      <div class="min-h-[300px] relative z-50 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
      <div className='container mx-auto items-center justify-center flex mt-10'>
        <h1 className="text-7xl">Welcome to <span className="inline-block bg-gradient-to-r from-blue-500 to-orange-400 text-transparent bg-clip-text font-bold text-7xl font-bold">Final Score!</span></h1>
      </div>
        <p class="text-2xl text-center text-gray-200 py-5 font-bold">Learn more about the beautiful game</p>
      </div>
    </div>
      <div className="mb-4 px-10 py-5">
        <label
          htmlFor="decisionType"
          className="block text-gray-700 font-bold mb-2 text-lg"
        >
          Choose Your Fun Fact!
        </label>
        <select
          id="decisionType"
          className="border border-gray-300 rounded-md w-full px-3 py-2"
          // onChange={(e) => setFunFact(e.target.value)}
          onClick={(e) => handleFunFact(e.target.value)}
        >
          <option value="0">Select an Option</option>
          <option value="1">Teams with Highest attendance</option>
          <option value="2">Top Foul Commiting Players</option>
          <option value="3">Most Disadvantaged Players</option>
        </select>
      </div>
      <div className='flex flex-col items-center'>
      <button  className="bg-blue-500 text-white font-bold px-6 py-2 rounded-md hover:scale-120 hover:bg-gradient-to-r from-orange-400 to-blue-500" onClick={() => handleFunFact(Math.floor(Math.random() * 3) + 1)}> RANDOM!</button>
      </div>
      <div id='attendance' className='hidden p-10'>
        <table className="w-full table-auto border-collapse border text-center"> <thead>
                <tr>
                  <th className="border p-2">Team</th>
                  <th className="border p-2">Average Attendance</th>
                  <th className="border p-2">Max Attendance</th>
                </tr>
              </thead>
              <tbody>
                {funFactData.map((stat) => (
                  <tr>
                    <td className="border p-2">{stat.name}</td>
                    <td className="border p-2">{stat.avg_attendance}</td>
                    <td className="border p-2">{stat.max_attendance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
      </div>

      <div id='foulmaster' className='hidden p-10'>
        <table className="w-full table-auto border-collapse border text-center"> <thead>
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Fouls Commited</th>
                </tr>
              </thead>
              <tbody>
                {funFactData.map((stat) => (
                  <tr>
                    <td className="border p-2">{stat.first_name} {stat.last_name}</td>
                    <td className="border p-2">{stat.foul_count}</td>
                  </tr>
                ))}
              </tbody>
        </table>
      </div>

      <div id='disadvantagedking' className='hidden p-10'>
        <table className="w-full table-auto border-collapse border text-center"> <thead>
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Disadvantaged Calls</th>
                </tr>
              </thead>
              <tbody>
                {funFactData.map((stat) => (
                  <tr>
                    <td className="border p-2">{stat.first_name} {stat.last_name}</td>
                    <td className="border p-2">{stat.disadvantaged_calls}</td>
                  </tr>
                ))}
              </tbody>
        </table>
      </div>

    </>
  );
}
