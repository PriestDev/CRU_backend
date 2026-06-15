// components/RideCard.tsx
"use client";

import { rideProps } from "@/app/(rider)/data";

const RideCard = (props: rideProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-(--stroke)/10 shadow-xs">
      <div className="flex items-center gap-3">
        <img
          src={props.image}
          alt={props.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h4 className="font-bold text-sm">{props.name}</h4>
          <p className="text-(--lightText) text-xs">{props.type}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <h4 className="font-bold text-base">₦{props.price}</h4>
        <button
          className="text-(--primary) text-xs font-semibold"
          onClick={props.onViewDetails}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default RideCard;
