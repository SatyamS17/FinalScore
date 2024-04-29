"use client"
import React, { useState, useEffect } from 'react';
import Navbar from './navbar';


export default function Signup() {
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");

    // useEffect(() => {
    //     const token = cookieParser.parse(document.cookie).token;
    //     if (token) {
    //         setToken(token);
    //     }
    // }, []);
    useEffect(() => {
        const timeoutId = setTimeout(() => { setMessage('') }, 5000);
        return () => clearTimeout(timeoutId); 
    }, [message]);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ newFirstName, newLastName, newEmail, newPassword }),
            });
            const data = await response.json();
            console.log(data.message);
            if (response.ok) {
                setMessage(data.message);
                setNewEmail('');
                setNewFirstName('');
                setNewLastName('');
                setNewPassword('');
            } else {
                setMessage(`User with the email address '${newEmail}' already exists!`);
                setNewEmail('');
                setNewFirstName('');
                setNewLastName('');
                setNewPassword('');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center mt-32 p-6">
                <form className='w-full max-w-sm bg-gray-100 rounded-lg shadow-md p-6' onSubmit={handleSignup}>
                    <h1 className='text-2xl font-bold mb-4'>Sign Up</h1>
                    <div className="mb-3">
                        <label htmlFor="last_name" className="form-label">First Name</label>
                        <input type="text" className="form-control block w-full p-1 mt-1 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" id="email" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="last_name" className="form-label">Last Name</label>
                        <input type="text" className="form-control block w-full p-1 mt-1 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" id="email" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control block w-full p-1 mt-1 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" id="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control block w-full p-1 mt-1 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" id="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-3 py-2.5 bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 text-white font-medium rounded-md">Sign Up</button>
                    <p className='mt-3'>{message}</p>
                </form>
            </div>
        </>
    )
}