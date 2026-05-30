"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/button";
import PageHeader from "@/components/layout/pageHeader";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Suspense } from "react";
import Input from "@/components/ui/input";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get("token") || "";
    if (!tokenParam) {
      setError("Invalid or missing reset token. Please try again.");
    }
    setToken(tokenParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate inputs
    if (!newPassword.trim()) {
      setError("Password is required");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("✅ Password reset successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login/student");
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader text="Reset Password" />
      <div className="p-4 space-y-4">
        <p className="text-(--ash)">
          Enter your new password below. Make sure it's secure and unique.
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New password input */}
          <div className="relative">
            <Input
              id="newPassword"
              label="New Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-2/3 -translate-y-1/2 text-(--ash)"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          {/* confirm password input */}
          <div className="relative">
            <Input
              id="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-2/3 -translate-y-1/2 text-(--ash)"
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          {/* Submit button */}
          <Button
            text={loading ? "Resetting..." : "Reset Password"}
            type="submit"
            bgColor="primary"
            disabled={loading}
          />
        </form>

        {/* Back to login */}
        <p className="text-center">
          <button
            onClick={() => router.push("/login/student")}
            className="text-(--primary) hover:underline"
          >
            Back to login
          </button>
        </p>
      </div>
    </>
  );
};

export default ResetPasswordPage;
