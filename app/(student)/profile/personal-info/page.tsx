"use client";

import Image from "next/image";
import PageHeader from "@/components/layout/pageHeader";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

const page = () => {
  const [form, setForm] = useState({
    name: "Alex Johnson",
    email: "alex.j@uniport.edu.ng",
    ID: "U-200001",
    phoneNumber: "+234 803 000 0000",
    newPassword: "",
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
        <form className="space-y-4">
          {/* name input field */}
          <Input id="name" label="Full Name" type="text" placeholder="Enter fullname" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          {/* email input field */}
          <Input id="email" label="Email" type="email" placeholder="Enter your email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} disabled={true} />
          {/* phone number input field */}
          <Input id="number" label="Phone Number" type="text" placeholder="Enter your phone number" value={form.phoneNumber} onChange={(e)=>setForm({...form, phoneNumber: e.target.value})} />
          {/* id input field */}
          <Input id="id" label="Campus ID" type="text" placeholder="Enter your cmpus ID" value={form.ID} onChange={(e)=>setForm({...form, ID: e.target.value})} disabled={true} />
          {/* new password input field */}
          <Input id="newPassword" label="New Password" type="text" placeholder="Enter a new password" value={form.newPassword} onChange={(e)=>setForm({...form, newPassword: e.target.value})}/>
          {/* confirm new password input field */}
          <Input id="confirmNewPassword" label="Confirm New Password" type="text" placeholder="Confirm your new password" value={form.newPassword} onChange={(e)=>setForm({...form, newPassword: e.target.value})}/>
          {/* submit button */}
          <Button text="Save Changes" type="submit" bgColor="primary" />
        </form>
      </div>
    </div>
  );
};

export default page;
