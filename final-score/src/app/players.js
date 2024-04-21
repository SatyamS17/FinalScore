"use client"
import React, { useState, useEffect } from 'react';

export default function PlayersPage() {
    const [playerName, setPlayerName] = useState('');
    const [year, setYear] = useState('');
    const [limit, setLimit] = useState(20);
    const [callType, setCallType] = useState('');
    const [decisionType, setDecisionType] = useState('');
    const [playerResults, setPlayerResults] = useState([]);
    const [callCountResult, setCallCountResult] = useState(0);
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [addPlayerMessage, setAddPlayerMessage] = useState(''); 
    const [teamOptions, setTeamOptions] = useState([]);

    // Fetch teams for dropdown
    useEffect(() => {
        const fetchTeams = async () => {
            const response = await fetch('/api/teams');
            const data = await response.json();
    
            if (data.error) {
                console.error('Error fetching teams:', data.error);
            } else {
                setTeamOptions(data); 
            }
        };
        fetchTeams();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => { setAddPlayerMessage('') }, 8000);
        return () => clearTimeout(timeoutId); 
    }, [addPlayerMessage]);

    // Fetch Player Calls
    const handlePlayerCallSearch = async (e) => {
        e.preventDefault();
        const response = await fetch(`/api/players?playerName=${playerName}&year=${year}&limit=${limit}`);
        const data = await response.json();

        if (data.error) {
            console.error('Error fetching calls:', data.error);
        } else {
            setPlayerResults(data);
            setPlayerName('');
            setYear('');
            setLimit('');
        }
    };

    // Fetch Call Counts
    const handleCallCountSearch = async (e) => {
        e.preventDefault();
        const response = await fetch(`/api/players?playerName=${playerName}&callType=${callType}&decisionType=${decisionType}`);
        const data = await response.json();

        if (data.error) {
            console.error('Error fetching call counts:', data.error);
        } else {
            setCallCountResult(data.callCount); 
            
        }
    };

    // Add Player
    const handleAddPlayer = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newFirstName, newLastName, selectedTeamId }),
        });

        const data = await response.json();

        if (response.ok) {
            setAddPlayerMessage(data.message);
            setNewFirstName('');
            setNewLastName('');
            setSelectedTeamId(''); 
        } else {
            console.error('Error adding player: ', data.error);
        }
    };

     // Delete Call from Database
     async function handleDeleteEntry(callId) {
        
        const response = await fetch(`/api/calls`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callId }),
          });
        
        if (response.ok) {
            setPlayerResults(playerResults.filter((call) => call.call_id !== callId));
        } else {
          console.error('Error deleting call:', await response.text());
        }
    };

    return (
        <div className="bg-white text-black p-6"> 
        <div className="container mx-auto"> <h1 className='text-3xl font-bold'>Final Score</h1>
      
          <div className="grid grid-cols-2 gap-8 mt-6">
            <section className="border border-gray-300 rounded-md p-4"> 
              <h2 className='text-xl mb-2'>Search Player Calls</h2>
              <form onSubmit={handlePlayerCallSearch}>
                <div className="mb-4">
                    <label htmlFor="playerName" className="block text-gray-700 font-bold mb-2">Player Name:</label>
                    <input type="text" id="playerName" onChange={(e) => setPlayerName(e.target.value)} 
                        className="border border-gray-300 rounded-md w-full px-3 py-2" />
                </div>

                <div className="mb-4">
                    <label htmlFor="year" className="block text-gray-700 font-bold mb-2">Year (Optional):</label>
                    <input type="text" id="year" value={year} onChange={(e) => setYear(e.target.value)} 
                        className="border border-gray-300 rounded-md w-full px-3 py-2" />
                </div>

                <div className="mb-4">
                    <label htmlFor="limit" className="block text-gray-700 font-bold mb-2">Limit (Optional):</label>
                    <input type="number" id="limit" value={limit} onChange={(e) => setLimit(e.target.value)} 
                        className="border border-gray-300 rounded-md w-full px-3 py-2" />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Search Calls
                </button>
              </form>
            </section>
      
            <section className="border border-gray-300 rounded-md p-4"> 
              <h2 className='text-xl mb-2'>Search Call Counts</h2>
              <form onSubmit={handleCallCountSearch}>
                <div className="mb-4">
                    <label htmlFor="playerName" className="block text-gray-700 font-bold mb-2">Player Name:</label>
                    <input type="text" id="playerName" onChange={(e) => setPlayerName(e.target.value)} 
                        className="border border-gray-300 rounded-md w-full px-3 py-2" />
                </div>

                <div className="mb-4">
                    <label htmlFor="callType" className="block text-gray-700 font-bold mb-2">Call Type:</label>
                    <select id="callType" value={callType} onChange={(e) => setCallType(e.target.value)}
                            className="border border-gray-300 rounded-md w-full px-3 py-2">
                        <option value="">Select Type</option>
                        <option value="committed">Committed</option>
                        <option value="disadvantaged">Disadvantaged</option>
                    </select>
                </div>

                <div className="mb-4 ">
                    <label htmlFor="decisionType" className="block text-gray-700 font-bold mb-2">Decision Type:</label>
                    <select id="decisionType" value={decisionType} onChange={(e) => setDecisionType(e.target.value)}
                            className="border border-gray-300 rounded-md w-full px-3 py-2">
                        <option value="">Select Type</option>
                        <option value="incorrect">Incorrect</option>
                        <option value="correct">Correct</option>
                        <option value="all">All</option>
                    </select>
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Search Call Counts
                </button>
              </form>
            </section>
      
          </div>
      
          <section className="mt-8 border border-gray-300 rounded-md p-4">
            <h2 className='text-xl mb-2'>Add Player</h2>
            <form onSubmit={handleAddPlayer}>
                <div className="mb-4">
                    <label htmlFor="newFirstName" className="block text-gray-700 font-bold mb-2">New Player First Name:</label>
                    <input type="text" id="newFirstName" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)}
                            className="border border-gray-300 rounded-md w-full px-3 py-2" />
                </div>

                <div className="mb-4">
                    <label htmlFor="newLastName" className="block text-gray-700 font-bold mb-2">New Player Last Name:</label>
                    <input type="text" id="newLastName" value={newLastName} onChange={(e) => setNewLastName(e.target.value)}
                            className="border border-gray-300 rounded-md w-full px-3 py-2" />
                </div>

                <div className="mb-4">
                    <label htmlFor="teamId" className="block text-gray-700 font-bold mb-2">Team:</label>
                    <select id="teamId" value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="border border-gray-300 rounded-md w-full px-3 py-2">
                        <option value="">Select a Team</option>
                        {teamOptions.map((team) => (
                            <option key={team.team_id} value={team.team_id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Add Player
                </button>
            </form>
            <div id="addPlayerMessage" className="mt-4 text-green-600">
                {addPlayerMessage}
            </div> 
          </section>
      
          <section className="mt-8"> 
            <h2 className='text-3xl font-bold'>Results</h2>
      
            <div className="grid grid-cols-1 gap-8 mt-4"> 
              <div>
                <h3 className='text-xl mb-2'>Player Call Results for <span className='italic'>{playerName}</span></h3>
                <table className="w-full table-auto border-collapse border"> <thead>
                    <tr>
                      <th className="border p-2">Date</th>
                      <th className="border p-2">Home Team</th>
                      <th className="border p-2">Away Team</th>
                      <th className="border p-2">Box Score</th>
                      <th className="border p-2">Call Type</th>
                      <th className="border p-2">Decision</th>
                      </tr>
                  </thead>
                  <tbody>
                    {playerResults.map((call) => (
                      <tr key={call.call_id}>
                        <td className="border p-2">{call.game_date.substring(0,10)}</td>
                        <td className="border p-2">{call.home_team}</td>
                        <td className="border p-2">{call.away_team}</td>
                        <td className="border p-2">{call.box_score}</td>
                        <td className="border p-2">{call.call_type}</td>
                        <td className="border p-2">{call.decision}</td>
                        <td><button onClick={() => handleDeleteEntry(call.call_id)} className='border-hidden text-red-500 font-bold p-2 text-lg'>X</button></td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
      
              <div>
                <h3 className='text-xl mb-2'>Call Count Results for <span className='italic'>{playerName}</span></h3>
                {callCountResult !== null ? ( 
                  <p className="text-lg font-bold">Number of {callType} {decisionType} calls: <span className='text-green-600'>{callCountResult}</span></p> 
                  
                ) : (
                  <p>No call count results found.</p>
                )}
              </div>
              
            </div>
      
          </section>
        </div>
      </div>
    );
}