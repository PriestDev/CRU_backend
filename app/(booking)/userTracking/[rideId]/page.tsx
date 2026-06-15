// app/tracking/[rideId]/page.tsx
"use client";

import { useState } from "react";

export default function RidePage({ params }: { params: { rideId: string } }) {
  const rideId = params.rideId;
  const [status, setStatus] = useState<"on-the-way" | "started">(
    "on-the-way",
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* MAP SECTION */}
      <div className="relative h-[30vh] w-full z-0">
        <iframe
          className="w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.254957898318!2d6.917814454244981!3d4.896932192097978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069da7f7bf8c433%3A0x6665c08e429606dd!2sUniversity%20of%20Port%20Harcourt!5e0!3m2!1sen!2sng!4v1780049037438!5m2!1sen!2sng"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>

      {/* Ride details card */}
      <main className="relative z-10 -mt-6 flex-1 bg-white rounded-t-3xl border-2 border-(--stroke)/50 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">
            {status === "on-the-way" && "Rider on the way"}
            {status === "started" && "Ride in progress"}
          </h1>
          <span className="font-bold text-(--primary)">₦2,400</span>
        </div>

        <p className="text-(--ash)">
          {status === "on-the-way" && (
            <>
              Arriving in{" "}
              <span className=" font-bold text-(--primary)">2 mins</span>
            </>
          )}
          {status === "started" && "Ride started..."}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-(--stroke)/30 h-2 rounded-full">
          <div className="bg-(--primary) h-2 rounded-full w-3/4"></div>
        </div>

        {/* Rider info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://placehold.net/avatar-4.svg"
              alt="Rider"
              className="rounded-full w-10 h-10"
            />
            <div>
              <p className="font-bold">Alex Johnston</p>
              <p className="text-(--lightText)">
                ABC-123-XY • TOYOTA COROLLA
              </p>
              <p className="text-yellow-500 font-bold">★ 4.9</p>
            </div>
          </div>

          <button className="bg-(--primary)/10 p-2 rounded-full text-(--primary)">
            <span className="material-symbols-outlined">call</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 bg-(--primary) text-white py-2 rounded-lg font-semibold">
            Message
          </button>
          <button className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-semibold">
            Cancel ride
          </button>
        </div>
      </main>
    </div>
  );
}
