"use client";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import TextBox from "@/components/ui/textBox";
import { useState } from "react";

const addContact = () => {
  const [relationshipIndex, setRelationshipIndex] = useState<number>(0);

  return (
    <div className=" z-60 fixed w-full top-0 left-0 bg-(--background) min-h-screen">
      <div className="border-b border-(--stroke) font-bold text-lg p-4 text-center">
        Add Emergency Contact
      </div>
      <main className=" p-4 space-y-4">
        <div className=" bg-(--primary)/10 rounded-lg p-4 border border-(--primary)/20 flex gap-2">
          <span className="material-symbols-outlined text-(--primary)">
            info
          </span>
          <p>
            Your emergency contacts will be notified automatically via SMS if
            you trigger the SOS button during a ride.
          </p>
        </div>
        <form action="" className="space-y-4">
          {/* full name */}
          <Input
            id="fullname"
            label="Full Name"
            type="text"
            placeholder="Enter contact's name"
          />
          {/* number */}
          <Input
            id="number"
            label="Phone Number"
            type="text"
            placeholder="+234 803 000 0000"
          />
          {/* relationship */}
          <div className=" flex flex-col gap-1">
            <label htmlFor="" className="font-semibold">
              Relationship
            </label>
            <div className="grid grid-cols-3 gap-2 text-(--lightText) border border-(--stroke) rounded-xl p-2 bg-(--primary)/10">
              {["Parent", "Friend", "Guardian"].map((relationship, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center rounded-lg p-2 font-semibold cursor-pointer ${relationshipIndex === index ? "bg-white text-(--primary)" : "bg-transparent"}`}
                  onClick={() => setRelationshipIndex(index)}
                >
                  <p>{relationship}</p>
                </div>
              ))}
            </div>
          </div>
          {/* custom SOS message */}
          <TextBox
            id="note"
            label="Notes for rider"
            placeholder="Emergency: I'm feeling unsafe on my CampusRide. Track my live location here..."
            extraText="This message will be sent along with your location when you trigger the SOS. Keep it concise."
          />
          {/* submit button */}
          <Button bgColor="primary" text="Save Contact" type="submit" />
        </form>
      </main>
    </div>
  );
};

export default addContact;
