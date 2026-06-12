import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthAPI } from "../api/AuthApi";
import { toast } from "react-toastify";

const VerifyTokenPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        toast.error("Invalid verification link");
        setLoading(false);
        return;
      }

      try {
        await AuthAPI.verifyOtp({ token });

        toast.success("Email verified successfully!");

        setTimeout(() => {
          navigate("/auth/login");
        }, 1500);

      } catch (error) {
        toast.error(error?.response?.data?.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        
        {loading ? (
          <h2 className="text-xl font-semibold text-gray-700">
            Verifying your email...
          </h2>
        ) : (
          <h2 className="text-xl font-semibold text-gray-700">
            Redirecting...
          </h2>
        )}

      </div>
    </div>
  );
};

export default VerifyTokenPage;