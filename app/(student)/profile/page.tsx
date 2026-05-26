"use client";

import PageHeader from "@/components/layout/pageHeader";
import { useState } from "react";
import Link from "next/link";
import Profilecard from "@/components/ui/profilecard";
import Button from "@/components/ui/button";
import Image from "next/image";

const page = () => {
  return (
    <div>
      <div className="border-b border-(--stroke)">
        <PageHeader
          text="Profile"
          //   extra={
          //     <span className="material-symbols-outlined text-(--primary)">
          //       settings
          //     </span>
          //   }
        />
      </div>
      <div className="p-4 space-y-4">
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
            <p className="text-(--ash)">Campus ID: 3020001</p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-2">
            <h4 className="font-bold uppercase text-(--ash) tracking-wider">
              Account Details
            </h4>
            <div className="space-y-2">
              <Profilecard
                title="Personal Information"
                text="Name, Email, Phone Number"
                icon="person"
                link="/profile/personal-info"
              />
              <Profilecard
                title="Emergency Contacts"
                text="Trusted friends & family"
                icon="badge"
                link="/profile/emergency-contacts"
              />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold uppercase text-(--ash) tracking-wider">
              Support & Legal
            </h4>
            <div className="space-y-2">
              <Profilecard
                title="Help & Support"
                text="FAQ's, Contact us"
                icon="help"
                link="/profile/help"
              />
              <Profilecard
                title="Privacy Policy"
                text="Terms of service"
                icon="gavel"
                link="/profile/privacy-policy"
              />
            </div>
          </div>
          <Button
            bgColor="red-100"
            text="Logout"
            className="bg-red-50 text-red-500 border border-red-100"
            onClick={() => null}
            type="button"
          />
        </div>
      </div>
    </div>
  );
};

export default page;
