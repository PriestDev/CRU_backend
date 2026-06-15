"use client";

import Button from "@/components/ui/button";
import { useState } from "react";

type Stop = {
  id: number;
  value: string;
};

const MultiStop = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stops, setStops] = useState<Stop[]>([]);
  const [note, setNote] = useState("");

  // Add stop (max 3)
  const addStop = () => {
    if (stops.length >= 3) return;

    setStops([
      ...stops,
      {
        id: Date.now(),
        value: "",
      },
    ]);
  };

  // Update stop value
  const updateStop = (id: number, value: string) => {
    setStops((prev) =>
      prev.map((stop) => (stop.id === id ? { ...stop, value } : stop)),
    );
  };

  // Remove stop
  const removeStop = (id: number) => {
    setStops((prev) => prev.filter((stop) => stop.id !== id));
  };

  return (
    <form className="space-y-4">
      <div className="flex gap-2 w-full">
        <div className="flex flex-col justify-around items-center">
          <div className="w-2 h-2 rounded-full border-2 border-(--primary)"></div>
          <div className="h-15 w-0.5 bg-(--stroke) rounded-full"></div>
          <span className="material-symbols-outlined text-(--primary)">
            location_pin
          </span>
        </div>
        <div className="space-y-2 flex flex-col justify-between gap-3 w-full">
          {/* FROM */}
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

          {/* DYNAMIC STOPS */}
          <div
            className={`space-y-2 ${stops.length === 0 ? "hidden" : "block"}`}
          >
            {stops.map((stop, index) => (
              <div key={stop.id} className="flex gap-2 items-center">
                <span className=" text-(--ash)">Stop {index + 1}</span>

                <input
                  type="text"
                  value={stop.value}
                  onChange={(e) => updateStop(stop.id, e.target.value)}
                  placeholder="Enter stop location"
                  className="flex-1 border border-(--stroke) rounded-lg bg-white p-2 focus:outline-(--primary)"
                />

                <button
                  type="button"
                  onClick={() => removeStop(stop.id)}
                  className="text-red-500"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            ))}

            {stops.length >= 3 && (
              <p className="text-xs text-(--ash)">Maximum of 3 stops allowed</p>
            )}
          </div>

          {/* TO */}
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

      <button
        type="button"
        onClick={addStop}
        disabled={stops.length >= 3}
        className="text-(--primary) disabled:opacity-50"
      >
        + Add Stop
      </button>

      {/* OPTIONAL NOTE */}
      <div>
        <p className="text-[10px] text-(--ash) font-bold">Note (optional)</p>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Pick me up at hostel gate"
          className="w-full border border-(--stroke) rounded-lg p-2 focus:outline-(--primary)"
        />
      </div>

      <Button type="submit" bgColor="primary" text="Find Ride" />
    </form>
  );
};

export default MultiStop;
