"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import PageHeader from "@/components/layout/pageHeader";

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate email
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("✅ Password reset link sent to your email. Check your inbox.");
        setEmail("");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login/student");
        }, 2000);
      } else {
        setError(data.message || "Failed to send reset link");
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
      <PageHeader text="Forgot Password" />
      <div className="p-4 space-y-10">
        <div className="space-y-2">
          <h4 className="text-xl font-bold">Forgot Password</h4>
          <p className=" text-(--ash)">
            Enter your registered email address to receive a secure password
            reset link.
          </p>
        </div>

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

        <form onSubmit={handleSubmit} className=" space-y-5">
          {/* email input field */}
          <div className="space-y-2 flex flex-col gap-0.5">
            <label htmlFor="email" className=" font-semibold text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@uniport.edu.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="bg-white border border-(--stroke) rounded-lg p-4.5 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {/* submit button */}
          <Button
            text={loading ? "Sending..." : "Send reset link"}
            type="submit"
            bgColor="primary"
            disabled={loading}
          />
        </form>
        {/* sign up text */}
        <p className=" text-center text-sm">
          Remember your password?{" "}
          <Link href="/login/student" className="text-(--primary)">
            Back to login
          </Link>
        </p>
      </div>
    </>
  );
};

export default page;
