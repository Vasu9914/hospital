import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthAPI } from "../api/AuthApi.js";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      return toast.error("Password is required");
    }

    if (!token) {
      return toast.error("Invalid or missing token");
    }

    try {
      setLoading(true);

      await AuthAPI.resetPassword({
        token: token,
        newPassword: password,
      });

      toast.success("Password reset successfully!");
      navigate("/auth/login");

    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
      
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="password"
            placeholder="Enter new password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

        {/* Optional back to login */}
        <p className="text-sm text-center text-gray-500 mt-4">
          Remember your password?{" "}
          <span
            className="text-indigo-600 cursor-pointer hover:underline"
            onClick={() => navigate("/auth/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;