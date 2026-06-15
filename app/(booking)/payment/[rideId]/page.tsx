// app/checkout/[rideId]/page.tsx
"use client";

import Button from "@/components/ui/button";

export default function CheckoutPage({
  params,
}: {
  params: { rideId: string };
}) {
  const rideId = params.rideId;

  // Example dynamic data (replace with real data from your backend)
  const ride = {
    driver: {
      name: "David Chen",
      image: "https://placehold.net/avatar-4.svg",
      vehicle: "Toyota Corolla",
      plate: "ABC-123-XY",
      rating: 4.9,
    },
    from: "Engineering Block B",
    to: "Main Campus Gate",
    distance: "4.2 km",
    baseFare: 450,
    distanceFare: 940,
    serviceFee: 20,
    total: 1410,
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-(--background) p-4 space-y-4">
      {/* Driver Info */}
      <div className="bg-white rounded-lg border border-(--stroke)/50 p-4 space-y-2">
        <div className="flex items-center gap-3">
          <img
            src={ride.driver.image}
            alt={ride.driver.name}
            className="rounded-full w-10 h-10"
          />
          <div>
            <p className="font-bold">{ride.driver.name}</p>
            <p className="text-(--ash)">
              {ride.driver.vehicle} • {ride.driver.plate}
            </p>
            <p className=" text-yellow-500 font-bold">
              ★ {ride.driver.rating}
            </p>
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-1">
          <p className="text-(--ash)">
            <span className="material-symbols-outlined text-(--primary) align-middle">
              location_on
            </span>{" "}
            {ride.from || "Faculty"}
          </p>
          <p className="text-(--ash)">
            <span className="material-symbols-outlined text-(--primary) align-middle">
              flag
            </span>{" "}
            {ride.to || "Campus Gate"}
          </p>
        </div>
      </div>

      {/* Fare Breakdown */}
      <div className="bg-white rounded-lg border border-(--stroke)/50 p-4 space-y-2">
        <h2 className="font-semibold">Fare Breakdown</h2>
        <div className="flex justify-between">
          <p>Base fare</p>
          <p className="font-bold">₦{ride.baseFare}</p>
        </div>
        <div className="flex justify-between">
          <p>Distance ({ride.distance})</p>
          <p className="font-bold">₦{ride.distanceFare}</p>
        </div>
        <div className="flex justify-between">
          <p>Service fee</p>
          <p className="font-bold">₦{ride.serviceFee}</p>
        </div>
        <hr className="border border-(--stroke)/30" />
        <div className="flex justify-between font-bold">
          <p>Total Amount</p>
          <p className="font-bold">₦{ride.total}</p>
        </div>
      </div>

      {/* Confirm Button */}
      <Button text="Confirm payment" bgColor="primary" type="submit" />
    </div>
  );
}
