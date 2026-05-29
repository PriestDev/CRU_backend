"use client";

import HeroImage from "../../../../assets/staff.png";
import Image from "next/image";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";

const page = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage("✅ Login successful! Redirecting...");
        // Store user data in localStorage (optional)
        localStorage.setItem("user", JSON.stringify(data.data));
        // Redirect to home
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col flex-1 bg-(--background) min-h-screen space-y-6">
      <div>
        <Image src={HeroImage} alt="Hero Image" width={500} height={300} />
      </div>

      <div className="px-4 py-3 space-y-4">
        <div className="space-y-2">
          <h4 className="text-xl font-bold">Student Login</h4>
          <p className=" text-(--ash)">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          )}

          {/* email input field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              University Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@uniport.edu.ng"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
              className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {/* password input field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <div className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed">
              <input
                id="password"
                type={visible ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
                className="w-full focus:border-0 focus:outline-0 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div
                onClick={() => setVisible(!visible)}
                className="text-(--ash) cursor-pointer"
              >
                {visible ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>
          {/* forgot password button */}
          <Link
            href={"/forgot-password"}
            className="float-right text-(--primary)"
          >
            Forgot password?
          </Link>
          {/* submit button */}
          <Button
            text={loading ? "Logging In..." : "Log In"}
            type="submit"
            bgColor="primary"
            disabled={loading}
          />
          {/* sign up text */}
          <p className="text-center">
            Don't have an account?{" "}
            <Link href={"/signup"} className="text-(--primary)">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default page;
