import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To handle error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state before submission

    try {
      const response = await axios.post("http://localhost:3002/signup", {
        name,
        email,
        password,
      });
      console.log(response.data);
      navigate("/"); // Navigate to home on successful signup
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "An error occurred. Please try again.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Sign Up</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <label className="block mb-2 text-sm font-medium text-black" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            className="w-full px-4 py-2 mb-4 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email Field */}
          <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 mb-4 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Field */}
          <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 mb-6 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
