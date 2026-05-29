"use client";
import Button from "@/components/ui/button";
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
          <span className="material-symbols-outlined text-(--primary)">info</span>
          <p>Your emergency contacts will be notified automatically via SMS if you trigger the SOS button during a ride.</p>
        </div>
        <form action="" className="space-y-4">
          {/* full name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="fullname" className="font-semibold">
              Full Name
            </label>
            <input
              id="fullname"
              type="text"
              placeholder="Enter contact's name"
              className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {/* number */}
          <div className="flex flex-col gap-1">
            <label htmlFor="number" className="font-semibold">
              Phone Number
            </label>
            <input
              id="number"
              type="text"
              placeholder="+234 803 000 0000"
              className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
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
          <div className="flex flex-col gap-1">
            <div className=" flex justify-between items-center">
              <label htmlFor="note" className="font-semibold">
                Notes for rider
              </label>
              <p className=" text-(--lightText)">0/120</p>
            </div>
            <textarea
              id="note"
              placeholder="Emergency: I'm feeling unsafe on my CampusRide. Track my live location here..."
              rows={5}
              className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className=" text-(--lightText)">This message will be sent along with your location when you trigger the SOS. Keep it concise.</p>
          </div>
          {/* submit button */}
          <Button bgColor="primary" text="Save Contact" type="submit" />
        </form>
      </main>
    </div>
  );
};

export default addContact;
