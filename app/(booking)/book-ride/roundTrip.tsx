"use client";

import Button from "@/components/ui/button";
import { useState } from "react";

const RoundTrip = () => {
  const [rideType, setRideType] = useState<"standard" | "carpool">("standard");
  const [passengers, setPassengers] = useState(1);
  const [note, setNote] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const basePrice = 3000; // round trip is usually higher than one-way

  const price =
    rideType === "carpool" ? Math.ceil(basePrice / passengers) : basePrice;

  return (
    <form className="space-y-4">
      {/* From / To */}
      <div className="flex gap-2 w-full">
        <div className="flex flex-col justify-around items-center">
          <div className="w-2 h-2 rounded-full border-2 border-(--primary)"></div>
          <div className="h-15 w-0.5 bg-(--stroke) rounded-full"></div>
          <span className="material-symbols-outlined text-(--primary)">
            location_pin
          </span>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <div>
            <p className="text-[10px] text-(--ash) font-bold">From</p>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Current location"
              className="w-full border border-(--stroke) rounded-lg bg-white p-2 focus:outline-(--primary)"
            />
          </div>

          <div>
            <p className="text-[10px] text-(--ash) font-bold">To</p>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Destination"
              className="w-full border border-(--stroke) rounded-lg bg-white p-2 focus:outline-(--primary)"
            />
          </div>
        </div>
      </div>

      {/* Return Trip Section */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] text-(--ash) font-bold">Return Date</p>
            <input
              type="date"
              className="w-full border border-(--stroke) rounded-lg p-2"
            />
          </div>

          <div>
            <p className="text-[10px] text-(--ash) font-bold">Return Time</p>
            <input
              type="time"
              className="w-full border border-(--stroke) rounded-lg p-2"
            />
          </div>
        </div>
      </div>

      {/* Ride Type */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setRideType("standard")}
          className={`flex flex-col items-center justify-center border-[1.75px] rounded-lg p-4 font-semibold ${
            rideType === "standard"
              ? "bg-(--primary) text-white"
              : "border-(--stroke)"
          }`}
        >
          <span className="material-symbols-outlined">directions_car</span>
          Standard
        </button>

        <button
          type="button"
          onClick={() => setRideType("carpool")}
          className={`flex flex-col items-center justify-center border-[1.75px] rounded-lg p-4 font-semibold ${
            rideType === "carpool"
              ? "bg-(--primary) text-white"
              : "border-(--stroke)"
          }`}
        >
          <span className="material-symbols-outlined">groups</span>
          Carpool
        </button>
      </div>

      {/* Passengers */}
      {rideType === "carpool" && (
        <div className="flex items-center justify-between">
          <p className="font-semibold">Passengers</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPassengers(Math.max(1, passengers - 1))}
            >
              -
            </button>

            <span>{passengers}</span>

            <button type="button" onClick={() => setPassengers(passengers + 1)}>
              +
            </button>
          </div>
        </div>
      )}

      {/* Price */}
      <div className="font-bold text-(--primary)">
        Estimated Price: ₦{price}
        {rideType === "carpool" && (
          <span className="text-(--ash)"> (shared among {passengers})</span>
        )}
      </div>

      {/* OPTIONAL NOTE */}
      <div>
        <p className="text-[10px] text-(--ash) font-bold">Note (optional)</p>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Pick me up at hostel gate"
          className="w-full border border-(--stroke) rounded-lg p-2"
        />
      </div>

      <Button type="submit" bgColor="primary" text="Check Ride" />
    </form>
  );
};

export default RoundTrip;
