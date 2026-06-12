import React, { useState } from "react";
import { AuthAPI } from "../api/AuthApi";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required");
    }

    try {
      setLoading(true);

      await AuthAPI.sendOtp({ email });

      toast.success("Verification link sent to your email!");
      setEmail("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
      
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Verify Email
        </h2>

        <form onSubmit={handleSend} className="space-y-5">
          
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Sending..." : "Send Verification Link"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EmailVerify;