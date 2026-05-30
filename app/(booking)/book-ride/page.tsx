"use client";

import PageHeader from "@/components/layout/pageHeader";
import { useState } from "react";
import OneWay from "./oneWay"
import RoundTrip from "./roundTrip"
import MultiStop from "./multiStop"
import Schedule from "./schedule"

const page = () => {
  const [tripType, setTripType] = useState<
    "oneWay" | "roundTrip" | "multiStops" | "schedule"
    >("oneWay");
  const [activeSection, setActiveSection] = useState(0)

  return (
    <div className="flex flex-col min-h-screen bg-(--background)">
      {/* Header */}
      <div className="border-b border-(--stroke)">
        <PageHeader text="Book A Ride" />
      </div>

      {/* MAP SECTION */}
      <div className="relative h-[30vh] w-full z-0">
        <iframe
          className="w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.254957898318!2d6.917814454244981!3d4.896932192097978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069da7f7bf8c433%3A0x6665c08e429606dd!2sUniversity%20of%20Port%20Harcourt!5e0!3m2!1sen!2sng!4v1780049037438!5m2!1sen!2sng"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>

      {/* FORM OVERLAY SECTION */}
      <main className="relative z-10 -mt-6 flex-1 bg-white rounded-t-3xl border-2 border-(--stroke)/50">
        {/* Tabs */}
        <div className="border-b border-(--stroke) px-4 grid grid-cols-4 text-center">
          {["One way", "Round trip", "Multi stop", "Schedule"].map(
            (trip, index) => (
              <div
                key={index}
                onClick={() => {
                  setTripType(
                    index === 0
                      ? "oneWay"
                      : index === 1
                        ? "roundTrip"
                        : index === 2
                          ? "multiStops"
                          : "schedule",
                  );
                  setActiveSection(index);
                }}
                className={`py-4 cursor-pointer transition ${
                  index === activeSection
                    ? "border-b-2 border-(--primary) font-bold text-black"
                    : "text-(--lightText)"
                }`}
              >
                {trip}
              </div>
            ),
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {tripType === "oneWay" && <OneWay />}
          {tripType === "roundTrip" && <RoundTrip />}
          {tripType === "multiStops" && <MultiStop />}
          {tripType === "schedule" && <Schedule />}
        </div>
      </main>
    </div>
  );
};

export default page;
