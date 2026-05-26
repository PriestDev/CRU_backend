"use client";

import HeroImage from "../../../../assets/staff.png";
import Image from "next/image";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import Link from "next/link";
import Button from "@/components/ui/button";

const page = () => {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  return (
    <div className="flex flex-col flex-1 bg-(--background) h-screen space-y-6">
      <div>
        <Image src={HeroImage} alt="Hero Image" width={500} height={300} />
      </div>

      <div className="px-4 py-3 space-y-10">
        <div className="">
          <h4 className="text-lg font-bold">Student Login</h4>
          <p className=" text-(--lightText)">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form action="" className=" space-y-2">
          {/* email input field */}
          <div className="space-y-2 flex flex-col gap-0.5">
            <label htmlFor="email" className=" font-semibold">
              University Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@uniport.edu.ng"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-white border border-(--stroke) rounded-lg p-4.5"
            />
          </div>
          {/* password input field */}
          <div className="space-y-2 flex flex-col gap-0.5">
            <label htmlFor="password" className=" font-semibold">
              Password
            </label>
            <div className="bg-white border border-(--stroke) rounded-lg p-4.5 flex items-center justify-between">
              <input
                id="password"
                type={visible ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full focus:border-0 focus:outline-0"
              />
              <div
                onClick={() => setVisible(!visible)}
                className="text-(--lightText)"
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
          <Button text="Log In" type="submit" bgColor="primary" />
          {/* sign up text */}
          <p className=" text-center">
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
