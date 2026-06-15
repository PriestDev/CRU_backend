// app/summary/page.tsx
"use client";

export default function SummaryPage() {
  return (
    <div className="flex flex-col justify-center min-h-screen p-4 space-y-4">
      <div className="text-center">
        <span className="material-symbols-outlined bg-green-100 rounded-full p-4 mx-auto text-green-500 font-bold">
          check
        </span>
        <h1 className="text-lg font-bold">Ride booked!</h1>
        <p className="text-(--lightText)">
          Waiting for a rider to accept ride.
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-(--stroke) space-y-2">
        <div className="flex items-center justify-between">
          <p>From</p>
          <p className="font-bold">Faculty of Engineering</p>
        </div>
        <div className="flex items-center justify-between">
          <p>To</p>
          <p className="font-bold">Amino Kano Hostel</p>
        </div>
        <hr className="border border-(--stroke) outline-none" />
        <div className="flex items-center justify-between">
          <p>Total fare</p>
          <p className="font-bold">N2000</p>
        </div>
      </div>

      <div className="mx-auto flex items-center space-x-2">
        <div className="bg-(--primary) rounded-full w-2 h-2 animate-ping"></div>
        <p className="text-(--primary) italic">Finding your rider...</p>
      </div>
    </div>
  );
}
