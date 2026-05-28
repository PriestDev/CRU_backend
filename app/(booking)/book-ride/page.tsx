"use client";

import PageHeader from "@/components/layout/pageHeader";
import { useState } from "react";
import dynamic from "next/dynamic";

// const Map = dynamic(() => import("@/components/ui/map"), {
//   ssr: false,
// });

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
      <div className="h-[60vh]"></div>
      <main className="bg-white rounded-t-4xl mt-[-20vh] z-100">
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
        <form action="" className="p-4">
          {tripType === "oneWay" && <div>One Way</div>}
          {tripType === "roundTrip" && <div>Round Trip</div>}
          {tripType === "multiStops" && <div>Multi Stops</div>}
          {tripType === "schedule" && <div>Scedule</div>}
        </form>
      </main>
    </div>
  );
};

export default page;
