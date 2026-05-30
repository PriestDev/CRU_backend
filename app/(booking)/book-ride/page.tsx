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
    <div>
      <div className="border-b border-(--stroke)">
        <PageHeader text="Book A Ride" />
      </div>
      {/* <Map/> */}
      <div className="h-[70vh] z-0">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.254957898318!2d6.917814454244981!3d4.896932192097978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069da7f7bf8c433%3A0x6665c08e429606dd!2sUniversity%20of%20Port%20Harcourt!5e0!3m2!1sen!2sng!4v1780049037438!5m2!1sen!2sng" height="350" style={{border:0}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <main className="relative bg-(--background) shadow-sm rounded-t-4xl mt-[-20vh] z-60 min-h-[20vh]">
        <div className="border-b border-(--stroke) px-4 text-(--lightText) grid grid-cols-4 text-center cursor-pointer">
          {["One way", "Round trip", "Multi stop", "Schedule"].map(
            (trip, index) => (
              <div
                className={`py-4 border-b-2 ${index === activeSection ? "border-(--primary) font-bold" : "border-transparent font-normal"}`}
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
              >
                {trip}
              </div>
            ),
          )}
        </div>
        <div className="p-4">
          {tripType === "oneWay" && <OneWay/>}
          {tripType === "roundTrip" && <RoundTrip/>}
          {tripType === "multiStops" && <MultiStop/>}
          {tripType === "schedule" && <Schedule/>}
        </div>
      </main>
    </div>
  );
};

export default page;
