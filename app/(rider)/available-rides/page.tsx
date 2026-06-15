// app/rider/rides/page.tsx
"use client";

import { rides } from "@/app/(rider)/data";
import RideCard from "@/components/ui/rideCard";

export default function AvailableRides() {
  return (
    <div className="min-h-screen bg-(--background) p-4 space-y-4 pb-20">
      <h1 className="text-lg font-bold">Available Rides</h1>
      {rides.map((ride) => (
        <RideCard key={ride.id} {...ride} />
      ))}
    </div>
  );
}
