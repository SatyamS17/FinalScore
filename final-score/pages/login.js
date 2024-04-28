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
            <div className="container">
                <h1>Login</h1>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" onClick={handleLogin}>Login</button>
                <p>{message}</p>
            </div>
        </>
    )
}