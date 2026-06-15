"use client";

import PageHeader from "@/components/layout/pageHeader";
import { trips } from "../data";
import { useState } from "react";
import Link from "next/link";
import TripCard from "@/components/ui/tripcard";

const page = () => {
  const ridesDone = trips.filter(
    (trip) => trip.type === "ride" || trip.type === "carpool",
  );
  const deliveriesDone = trips.filter((trip) => trip.type === "delivery");
  const [section, setSection] = useState<"ridesSection" | "deliveriesSection">(
    "ridesSection",
  );
  return (
    <div>
      <div className="border-b border-(--stroke)">
        <PageHeader text="Activity" />
      </div>
      <div className="border-b border-(--stroke) px-4 grid grid-cols-2 text-(--lightText)">
        <button
          className={`p-4 border-b-2 ${section === "ridesSection" ? "border-(--primary) font-bold text-(--primary)" : "border-transparent"}`}
          onClick={() => setSection("ridesSection")}
        >
          Trips
        </button>
        <button
          className={`p-4 border-b-2 ${section === "deliveriesSection" ? "border-(--primary) font-bold text-(--primary)" : "border-transparent"}`}
          onClick={() => setSection("deliveriesSection")}
        >
          Deliveries
        </button>
      </div>
      <div className="p-4 space-y-4">
        {/* <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold">Recent Trips</h4>
          <Link href="/activity" className="text-(--primary) font-bold">
            Filter
          </Link>
        </div> */}

        <div className="space-y-2">
          {section === "ridesSection" &&
            ridesDone.map((ride, index) => (
              <div key={index}>
                <TripCard
                  from={ride.from}
                  to={ride.to}
                  date={ride.date}
                  time={ride.time}
                  status={ride.status}
                  price={ride.price}
                  type={ride.type}
                />
              </div>
            ))}
          {section === "deliveriesSection" &&
            deliveriesDone.map((delivery, index) => (
              <div key={index}>
                <TripCard
                  from={delivery.from}
                  to={delivery.to}
                  date={delivery.date}
                  time={delivery.time}
                  status={delivery.status}
                  price={delivery.price}
                  type={delivery.type}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default page;
