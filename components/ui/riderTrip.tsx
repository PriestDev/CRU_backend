// components/RiderTrip.tsx
"use client";

import { useState } from "react";

export default function RiderTrip({ ride }: { ride: any }) {
  const [status, setStatus] = useState<"accepted" | "started" | "completed">("accepted");

  return (
    <div className="bg-white rounded-lg border border-(--stroke)/50 p-4 space-y-3">
      <h1 className="text-lg font-bold">
        {status === "accepted"
          ? "Ride Accepted"
          : status === "started"
          ? "Trip in Progress"
          : "Trip Completed"}
      </h1>

      <div className="flex items-center gap-3">
        <img src={ride.image} alt={ride.name} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-bold">{ride.name}</p>
          <p className="text-(--ash) text-sm">{ride.type}</p>
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <p>
          <strong>Pickup:</strong> {ride.pickup}
        </p>
        <p>
          <strong>Drop-off:</strong> {ride.dropoff}
        </p>
      </div>

      {status === "accepted" && (
        <button
          onClick={() => setStatus("started")}
          className="w-full bg-(--primary) text-white py-2 rounded-lg font-semibold"
        >
          Start Trip
        </button>
      )}

      {status === "started" && (
        <button
          onClick={() => setStatus("completed")}
          className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold"
        >
          End Trip
        </button>
      )}

      {status === "completed" && (
        <div className="space-y-2">
          <p className="font-semibold text-center text-(--primary)">
            Trip Completed — ₦{ride.price} earned
          </p>
          <button className="w-full bg-(--primary) text-white py-2 rounded-lg font-semibold">
            Confirm Payment
          </button>
        </div>
      )}
    </div>
  );
}
