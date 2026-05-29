"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import HeroImage from "../../../assets/staff.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import PrivacyPolicy from "./privacypolicy";

type UserRole = "staff" | "student" | "visitor";

interface FormState {
  email: string;
  userRole: UserRole;
}

const page = () => {
  const router = useRouter();
  const [loginModal, setLoginModal] = useState(false);
  const [loginRole, setLoginRole] = useState<UserRole>("student");
  const [form, setForm] = useState<FormState>({
    email: "",
    userRole: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);

  // Generic handler to manage input changes cleanly
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
    setError(""); // Clear error when user starts typing
  };

  // Handle signup form submission
  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate form
      if (!form.email.trim()) {
        setError("Email is required");
        setLoading(false);
        return;
      }

      if (!form.userRole) {
        setError("Please select an account type");
        setLoading(false);
        return;
      }

      // Store email and role for redirect
      const signupEmail = form.email;
      const signupRole = form.userRole;

      // Call signup API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: signupEmail,
            userRole: signupRole,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Success - set success state and redirect after delay
      setSuccess(true);
      setForm({ email: "", userRole: "student" });

      // Redirect to OTP page after 1.5 seconds
      setTimeout(() => {
        router.push(
          `/otp?email=${encodeURIComponent(signupEmail)}&role=${signupRole}`,
        );
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during signup",
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Image src={HeroImage} alt="Hero Image" width={500} height={300} />
      </div>
      <div className="px-4 py-3 space-y-4">
        <div className="">
          <h4 className="text-lg font-bold">Create account</h4>
          <p className="text-(--lightText)">
            Safe transit for the university community
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSignup}>
          {/* Email input field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              University Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="name@uniport.edu.ng"
              value={form.email}
              onChange={handleChange}
              className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3"
              disabled={loading}
            />
          </div>

          {/* role input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="userRole" className="font-semibold">
              Account type
            </label>
            <select
              id="userRole"
              value={form.userRole}
              onChange={handleChange}
              className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3"
              disabled={loading}
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="visitor">Visitor</option>
            </select>
          </div>

          {/* Error message display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Success message display */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              Signup successful! Redirecting to OTP verification...
            </div>
          )}

          {/* Privacy policy text */}
          <p className="">
            By clicking continue, you agree to our{" "}
            <span
              onClick={() => setPrivacyPolicy(true)}
              className="cursor-pointer text-(--primary)"
            >
              Privacy policy.
            </span>
          </p>

          {/* Submit button */}
          <Button
            text={loading ? "Loading..." : "Continue"}
            type="submit"
            bgColor="primary"
            disabled={loading}
          />
        </form>

        {/* Log in text - Fixed to point directly to form.userRole */}
        <p className="text-center">
          Already have an account?{" "}
          <button
            onClick={() => setLoginModal(true)}
            className="text-(--primary)"
          >
            Log In
          </button>
        </p>
      </div>

      {loginModal && (
        <div className=" fixed top-0 left-0 bg-black/80 h-screen w-full flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full space-y-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="loginRole" className="font-semibold">
                Login as...
              </label>
              <select
                id="loginRole"
                value={loginRole}
                onChange={(e) => setLoginRole(e.target.value as UserRole)}
                className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3"
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="visitor">Visitor</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                text="Cancel"
                type="button"
                bgColor="primary"
                onClick={() => setLoginModal(false)}
              />
              <Button
                text="Continue"
                type="button"
                bgColor="primary"
                onClick={() => {
                  if (loginRole === "student" || loginRole === "visitor") {
                    router.push("/login/student");
                  } else if (loginRole === "staff") {
                    router.push("/login/staff");
                  } else {
                    setError("Please select a role");
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
      {privacyPolicy && <PrivacyPolicy onClose={()=> setPrivacyPolicy(false)}/>}
    </>
  );
};

export default page;
