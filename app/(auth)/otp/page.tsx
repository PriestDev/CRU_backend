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

  // 2. Refs to target the input fields without document.querySelectorAll
  const inputRefs = useRef<HTMLInputElement[]>([]);

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length === 6) {
      alert("Verifying code: " + finalOtp);
    } else {
      alert("Please enter a valid 6-digit code");
    }
  };

  // 8. Resend Action
  const handleResend = () => {
    alert("Code resent to s.smith@campus.edu");
    setOtp(new Array(6).fill("")); // Reset inputs
    setTimeLeft(59); // Restart countdown
    setShowResend(false); // Hide resend button
    inputRefs.current[0]?.focus(); // Refocus first field
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
          <p className="font-semibold text-(--primary)">name@uniport.edu.ng</p>
        </div>

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
                className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold border border-outline-variant rounded-lg bg-surface transition-all focus:ring-2 focus:ring-(--primary) focus:outline-none"
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
                className="text-sm font-medium text-(--primary) hover:underline transition-opacity"
                type="button"
              >
                Didn't receive a code? Resend
              </button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            text="Verify"
            type="submit"
            bgColor="primary"
            onClick={() => router.push("/home")}
          />
        </form>
      </div>
    </>
  );
}
