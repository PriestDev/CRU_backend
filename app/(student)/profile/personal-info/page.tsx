"use client";

import Image from "next/image";
import PageHeader from "@/components/layout/pageHeader";
import { useState } from "react";
import Button from "@/components/ui/button";

const page = () => {
  const [form, setForm] = useState({
    name: "Alex Johnson",
    email: "alex.j@uniport.edu.ng",
    ID: "U-200001",
    phoneNumber: "+234 803 000 0000",
  });

  return (
    <div>
      <div className="border-b border-(--stroke)">
        <PageHeader text="Personal Information" />
      </div>
      <div className="p-4 space-y-4">
        {/* profile picture section */}
        <div className="flex flex-col gap-2 items-center py-4">
          <div className="h-25 w-25 rounded-full overflow-hidden flex items-center justify-center border-2.5 border-(--stroke) shadwow-xs">
            <Image
              src="http://placehold.net/avatar-4.svg"
              alt="profile picture"
              width={200}
              height={200}
            />
          </div>
          <div className="text-center">
            <h4 className="text-lg font-bold">Alex Johnson</h4>
            <p className="text-(--lightText)">
              <b>Campus ID:</b> 3020001
            </p>
          </div>
        </div>
        {/* form section */}
        <form className="space-y-5">
          {/* name input field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-semibold">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter fullname"
              defaultValue={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {/* email input field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your university email"
              defaultValue={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {/* phone number input field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="number" className="font-semibold">
              Phone Number
            </label>
            <input
              id="number"
              type="text"
              placeholder="Enter your phone number"
              defaultValue={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
              className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {/* id input field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="id" className="font-semibold">
              Campus ID
            </label>
            <input
              id="id"
              type="text"
              placeholder="Enter your campus ID"
              defaultValue={form.ID}
              onChange={(e) => setForm({ ...form, ID: e.target.value })}
              className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {/* submit button */}
          <Button text="Save Changes" type="submit" bgColor="primary" />
        </form>
      </div>
    </div>
  );
};

export default page;
