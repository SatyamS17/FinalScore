"use client"
import React, { useState, useEffect } from 'react';
import Navbar from './navbar';


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");

    // useEffect(() => {
    //     const token = cookieParser.parse(document.cookie).token;
    //     if (token) {
    //         setToken(token);
    //     }
    // }, []);

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.length > 0) {
                setToken(data[0].first_name);
                setMessage(`Welcome, ${data[0].first_name}!`);
                // document.cookie = `token=${data[0].first_name}`;
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        
        <>
            <Navbar />
            <div className="flex items-center justify-center mt-32 p-6">
                <div className='w-full max-w-sm bg-gray-100 rounded-lg shadow-md p-6'>
                <h1 className='text-2xl font-bold mb-4'>Login</h1>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control block w-full p-1 mt-1 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control block w-full p-1 mt-1 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary w-full mt-3 py-2.5 bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 text-white font-medium rounded-md" onClick={handleLogin}>Login</button>
                <p>{message}</p>
                </div>
            </div>
        </>
    )
}