"use client";

import Button from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/layout/pageHeader'

export default function OtpPage() {
  const router = useRouter()
  // 1. Component State
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(59);
  const [showResend, setShowResend] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // 2. Refs to target the input fields without document.querySelectorAll
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Get email from localStorage on mount
  useEffect(() => {
    const verificationEmail = localStorage.getItem("verificationEmail");
    if (!verificationEmail) {
      router.push("/signup");
      return;
    }
    setEmail(verificationEmail);
  }, [router]);

  // 3. Timer Logic using useEffect
  useEffect(() => {
    if (timeLeft <= 0) {
      setShowResend(true);
      return;
    }

    const countdown = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown); // Clean up interval on unmount
  }, [timeLeft]);

  // 4. Formatted Timer (MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // 5. Input Auto-focus & Change Handler
  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.slice(-1); // Only accept the last character typed
    if (!/^[0-9]$/.test(value) && value !== "") return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 6. Backspace and Navigation Logic
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current field is empty, move backward and clear previous field
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current field
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // 7. Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: finalOtp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "OTP verification failed. Please try again.");
        setLoading(false);
        return;
      }

      // Clear localStorage
      localStorage.removeItem("verificationEmail");
      localStorage.removeItem("userRole");

      // Redirect to dashboard or home
      router.push("/dashboard");
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  // 8. Resend Action
  const handleResend = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to resend OTP");
        setLoading(false);
        return;
      }

      setOtp(new Array(6).fill("")); // Reset inputs
      setTimeLeft(59); // Restart countdown
      setShowResend(false); // Hide resend button
      inputRefs.current[0]?.focus(); // Refocus first field
      setLoading(false);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader text="OTP Verification" />
      <div className="p-4 space-y-10 max-w-md mx-auto">
        <div className="space-y-2">
          <h4 className="text-3xl font-bold">Verify your email</h4>
          <p className="text-(--ash)">
            We've sent a 6-digit code to your email.
          </p>
          <p className="font-semibold text-(--primary)">{email}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 md:gap-4">
            {otp.map((data, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type="text" // Changed from 'number' to prevent native browser UI arrows
                inputMode="numeric"
                maxLength={1}
                pattern="[0-9]*"
                value={data}
                required
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={loading}
                className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold border border-outline-variant rounded-lg bg-surface transition-all focus:ring-2 focus:ring-(--primary) focus:outline-none disabled:opacity-50"
              />
            ))}
          </div>

          {/* Timer & Resend Container */}
          <div className="text-center min-h-6">
            {!showResend ? (
              <p className="text-sm text-on-surface-variant">
                Resend code in{" "}
                <span className="text-(--primary) font-bold">
                  {formatTime(timeLeft)}
                </span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm font-medium text-(--primary) hover:underline transition-opacity disabled:opacity-50"
                type="button"
                disabled={loading}
              >
                Didn't receive a code? Resend
              </button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            text={loading ? "Verifying..." : "Verify"}
            type="submit"
            bgColor="primary"
            disabled={loading}
          />
        </form>
      </div>
    </>
  );
}
