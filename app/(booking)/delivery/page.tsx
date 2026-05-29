"use client";

import PageHeader from "@/components/layout/pageHeader";
import { useState } from "react";
import Button from "@/components/ui/button";

const page = () => {
  const [deliveryIndex, setDeliveryIndex] = useState <number>(0)
  return (
    <div>
      <div className="border-b border-(--stroke)">
        <PageHeader text="Package Delivery" />
      </div>
      <form className=" p-4 space-y-5">
        <div className="space-y-2">
          <h4 className="font-bold uppercase text-(--lightText) tracking-wider">
            Route Details
          </h4>
          <div className="space-y-2">
            {/* pickup field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="pickup" className="font-semibold">
                Pickup Location
              </label>
              <input
                id="pickup"
                type="text"
                placeholder="Select pickup location..."
                className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            {/* dropoff field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="dropoff" className="font-semibold">
                Dropoff Location
              </label>
              <input
                id="dropoff"
                type="text"
                placeholder="Select dropoff location..."
                className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold uppercase text-(--lightText) tracking-wider">
            Package Information
          </h4>
          <div className="space-y-2">
            {/* package type */}
            <div className="grid grid-cols-3 gap-2 text-(--lightText)">
              {[
                { type: "Food", icon: "fastfood" },
                { type: "Docs", icon: "docs" },
                { type: "Other", icon: "inventory_2" },
              ].map((type, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center border-[1.75px] rounded-lg p-4 font-semibold cursor-pointer ${deliveryIndex === index ? "border-(--primary) text-(--primary)" : "border-(--stroke)"}`}
                  onClick={()=>setDeliveryIndex(index)}
                >
                  <span className="material-symbols-outlined">{type.icon}</span>
                  <p>{type.type}</p>
                </div>
              ))}
            </div>
            {/* rider note field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="note" className="font-semibold">
                Notes for rider
              </label>
              <textarea
                id="note"
                placeholder="Order #1, Please leave with Cynthia from room 005."
                rows={5}
                className="bg-white border border-(--stroke) rounded-lg p-4.5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            {/* delivery cost */}
            <div className=" bg-(--primary)/5 rounded-lg p-4 flex items-center justify-between border border-(--stroke)">
              <div>
                <p className=" text-(--lightText)">Estimated delivery fee</p>
                <h4 className="font-bold text-lg text-(--primary)">$4.50</h4>
              </div>
              <div className=" flex items-center bg-white rounded-full p-0.5 px-2 text-(--lightText) text-[10px]">
                {/* <span className="material-symbols-outlined">schedule</span> */}
                ~12 mins
              </div>
            </div>
          </div>
        </div>
        <Button text="Order delivery" type="submit" bgColor="primary"/>
      </form>
    </div>
  );
};

export default page;
