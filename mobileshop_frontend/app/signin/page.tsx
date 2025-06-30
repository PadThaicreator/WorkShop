/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, KeyboardEvent } from "react";
import { config } from "../config";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  const handleSignIn = async () => {
    try {
      const payload = { username, password };
      const response = await axios.post(`${config.apiUrl}/user/signin`, payload);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        router.push('/backoffice/dashboard');
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Username or password is invalids',
          icon: 'warning',
          timer: 2000,
        });
      }
    } catch (error : any) {
      Swal.fire({
        title: 'Login Failed',
        text: 'Invalid Username or Password',
        icon: 'warning',
      });

      console.log(error.message)
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSignIn();
    }
  };

  return (
    <div className="min-h-screen flex flex-1 items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
          
        </div>
        
        <div className="space-y-5">
          <div>
            <label htmlFor="username" className="block mb-2 text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSignIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center mt-2"
          >
            <i className="fa-solid fa-right-to-bracket"></i>
            <span className="ml-2">Sign In</span>
          </button>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don&apos;t have an account? 
              <a href="#" className="text-blue-600 hover:underline ml-1">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}