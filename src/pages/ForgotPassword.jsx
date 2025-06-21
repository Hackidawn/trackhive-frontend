import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/auth/forgot-password`, {
        email,
        newPassword,
      });
      setMessage(res.data.message || "✅ Password has been reset.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-800"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Reset Your Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 mb-4 bg-slate-800 text-white rounded border border-slate-700 placeholder-slate-400 focus:outline-none focus:ring focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter new password"
          className="w-full px-4 py-2 mb-4 bg-slate-800 text-white rounded border border-slate-700 placeholder-slate-400 focus:outline-none focus:ring focus:ring-blue-500"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-slate-300 text-center">{message}</p>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;
