"use client";

import PageHeader from "@/components/layout/pageHeader";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import TextBox from "@/components/ui/textBox";

const page = () => {
  const [deliveryIndex, setDeliveryIndex] = useState<number>(0);
  return (
    <div>
      <div className="border-b border-(--stroke)">
        <PageHeader text="Package Delivery" />
      </div>
      <form className=" p-4 space-y-4">
        <div className="space-y-2">
          <h4 className="font-bold uppercase text-(--lightText) tracking-wider">
            Route Details
          </h4>
          <div className="space-y-4">
            {/* pickup field */}
            <Input
              id="pickup"
              label="Pickup Location"
              placeholder="Select pickup location..."
              type="text"
            />
            {/* dropoff field */}
            <Input
              id="dropoff"
              label="Dropoff Location"
              placeholder="Select dropoff location..."
              type="text"
            />
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold uppercase text-(--lightText) tracking-wider">
            Package Information
          </h4>
          <div className="space-y-4">
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
                  onClick={() => setDeliveryIndex(index)}
                >
                  <span className="material-symbols-outlined">{type.icon}</span>
                  <p>{type.type}</p>
                </div>
              ))}
            </div>
            {/* rider note field */}
            <TextBox
              id="note"
              label="Note for rider"
              placeholder="Order #1, Please leave with Cynthia from room 005."
            />
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
        <Button text="Order delivery" type="submit" bgColor="primary" />
      </form>
    </div>
  );
};

export default page;
