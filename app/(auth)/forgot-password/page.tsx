"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import PageHeader from "@/components/layout/pageHeader";

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
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

        <form action="" className=" space-y-5">
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
              onChange={(e) => e.target.value}
              className="bg-white border border-(--stroke) rounded-lg p-4.5"
            />
          </div>
          {/* submit button */}
          <Button text="Send reset link" type="submit" bgColor="primary" />
        </form>
        {/* sign up text */}
        <p className=" text-center text-sm">
          Don't have an account?{" "}
          <span onClick={() => router.back()} className="text-(--primary)">
            Back to login
          </span>
        </p>
      </div>
    </>
  );
};

export default page;
