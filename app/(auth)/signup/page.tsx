"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import HeroImage from "../../../assets/staff.png";
import Image from "next/image";
import {useRouter} from "next/navigation"
import Button from "@/components/ui/button";

type UserRole = "staff" | "student" | "visitor";

interface FormState {
  email: string;
  userRole: UserRole;
}

const page = () => {
  const router = useRouter()
  const [loginModal, setLoginModal] = useState(false);
  const [loginRole, setLoginRole] = useState<UserRole>("student")
  const [form, setForm] = useState<FormState>({
    email: "",
    userRole: "student",
  });

  // Generic handler to manage input changes cleanly
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <>
      <div>
        <Image src={HeroImage} alt="Hero Image" width={500} height={300} />
      </div>
      <div className="px-4 py-3 space-y-10">
        <div className="space-y-2">
          <h4 className="text-3xl font-bold">Create account</h4>
          <p className="text-(--ash)">
            Safe transit for the university community
          </p>
        </div>

        <form className="space-y-5">
          {/* Email input field */}
          <div className="space-y-2 flex flex-col gap-0.5">
            <label htmlFor="email" className="font-semibold text-sm">
              University Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="name@uniport.edu.ng"
              value={form.email}
              onChange={handleChange}
              className="bg-white border border-(--stroke) rounded-lg p-4.5"
            />
          </div>

          {/* role input */}
          <div className="space-y-2 flex flex-col gap-0.5">
            <label htmlFor="userRole" className="font-semibold text-sm">
              Account type
            </label>
            <select
              id="userRole"
              value={form.userRole}
              onChange={handleChange}
              className="bg-white border border-(--stroke) rounded-lg p-4.5"
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="visitor">Visitor</option>
            </select>
          </div>

          {/* Privacy policy text */}
          <p className="text-sm">
            By clicking continue, you agree to our{" "}
            <Link href="/privacy-policy" className="text-(--primary)">
              Privacy policy.
            </Link>
          </p>

          {/* Submit button */}
          <Button text="Continue" type="submit" bgColor="primary" onClick={()=> router.push('/otp')}/>
        </form>

        {/* Log in text - Fixed to point directly to form.userRole */}
        <p className="text-center text-sm">
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
          <div className="bg-white rounded-xl p-6 w-full space-y-5">
            <div className="space-y-2 flex flex-col gap-0.5">
              <label htmlFor="loginRole" className="font-semibold text-sm">
                Login as...
              </label>
              <select
                id="loginRole"
                value={loginRole}
                onChange={(e) => setLoginRole(e.target.value as UserRole)}
                className="bg-white border border-(--stroke) rounded-lg p-4.5"
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="visitor">Visitor</option>
              </select>
            </div>
            <Button
              text="Continue"
              type="submit"
              bgColor="primary"
              onClick={() => {
                loginRole === "student" || "visitor"
                  ? router.push("/login/student")
                  : router.push("/login/staff");
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default page;
