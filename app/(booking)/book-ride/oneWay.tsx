"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useState } from "react";

const OneWay = () => {
  const [rideType, setRideType] = useState<"standard" | "carpool">("standard");
  const [passengers, setPassengers] = useState(1);

  const basePrice = 2000;

  const price =
    rideType === "carpool" ? Math.ceil(basePrice / passengers) : basePrice;

  return (
    <form className="space-y-4">
      {/* From / To */}
      <div className="flex gap-2 w-full">
        
        <div className="flex flex-col justify-around items-center">
          
          <div className=" w-2 h-2 rounded-full border-2 border-(--primary)"></div>
          <div className=" h-15 w-0.5 bg-(--stroke) rounded-full"></div>
          <span className="material-symbols-outlined text-(--primary)">
            
            location_pin
          </span>
        </div>
        <div className="flex flex-col justify-between gap-3 w-full">
          
          <div>
            
            <p className=" text-[10px] capitalize text-(--ash) font-bold">
              
              From
            </p>
            <input
              type="text"
              placeholder="Curent location"
              className="w-full border border-(--stroke) rounded-lg bg-white p-2 focus:outline-(--primary)"
            />
          </div>
          <div>
            
            <p className=" text-[10px] capitalize text-(--ash) font-bold">
              To
            </p>
            <input
              type="text"
              placeholder="Destination"
              className="w-full border border-(--stroke) rounded-lg bg-white p-2 focus:outline-(--primary)"
            />
          </div>
        </div>
      </div>

      {/* Ride Type */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setRideType("standard")}
          className={`flex flex-col items-center justify-center border-[1.75px] rounded-lg p-4 font-semibold cursor-pointer ${
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
          className={`flex flex-col items-center justify-center border-[1.75px] rounded-lg p-4 font-semibold cursor-pointer ${
            rideType === "carpool"
              ? "bg-(--primary) text-white"
              : "border-(--stroke)"
          }`}
        >
          <span className="material-symbols-outlined">groups</span>
          Carpool
        </button>
      </div>

      {/* Carpool Options */}
      {rideType === "carpool" && (
        <div className="flex items-center justify-between">
          <p className="font-semibold">Passengers</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPassengers(Math.max(1, passengers - 1))}
              className="px-2"
            >
              -
            </button>

            <span>{passengers}</span>

            <button
              type="button"
              onClick={() => setPassengers(passengers + 1)}
              className="px-2"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Price Preview */}
      <div className="font-bold text-(--primary)">
        Estimated Price: ₦{price}
        {rideType === "carpool" && (
          <span className="text-(--ash)"> (shared among {passengers})</span>
        )}
      </div>

      <Button type="submit" bgColor="primary" text="Check Ride" />
    </form>
  );
};

export default OneWay;
