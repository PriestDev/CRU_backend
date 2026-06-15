// 'use client'
import { CarpoolTrip } from "@/app/(booking)/data";
import Image from "next/image";

const carpoolcard = (props: CarpoolTrip) => {
  return (
    <div className="border border-(--stroke) rounded-lg p-4 space-y-2">
      <div className=" flex flex-col gap-2.5">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <div className=" w-10 h-10 flex items-center justify-center rounded-full">
              <Image
                src={props.driverImage}
                alt="Drivers Image"
                width={100}
                height={100}
              />
            </div>
            <div className="leading-2">
              <h4 className="text-sm font-bold">{props.driverName}</h4>
              <p className="text-(--lightText) flex items-center font-semibold">
                <span className="material-symbols-outlined">star</span>
                {props.rating} ({props.totalRides} rides)
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end leading-2">
            <h4 className="font-bold text-base text-(--primary)">
              ${props.pricePerSeat.toFixed(2)}
            </h4>
            <p className="text-(--lightText) font-semibold">per seat</p>
          </div>
        </div>
        <div className=" flex">
          {/* line */}
          <div className=" w-0.5 bg-(--primary)/30 h-11.5"></div>
          {/* details */}
          <div className=" flex flex-col gap-4 -ml-1.25">
            {/* from */}
            <div className=" flex gap-1">
              {/* point */}
              <div className=" w-2 h-2 bg-(--primary) rounded-full"></div>
              {/* details*/}
              <div className="leading-3.5">
                <p className=" text-(--lightText)">
                  {props.departureTime} ▪ From
                </p>
                <h4 className="font-bold">{props.from}</h4>
              </div>
            </div>
            {/* to */}
            <div className=" flex gap-1">
              {/* point */}
              <div className=" w-2 h-2 border-2 border-(--primary) rounded-full"></div>
              {/* details*/}
              <div className="leading-3.5">
                <p className=" text-(--lightText)">{props.arrivalTime} ▪ To</p>
                <h4 className="font-bold">{props.to}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="outline-0 border-(--stroke)" />

      <div className=" flex items-center justify-between">
        <div className=" flex items-center gap-1 text-(--lightText) font-semibold">
          <span className="material-symbols-outlined">chair</span>
          <p>
            {props.seatsLeft} {props.seatsLeft === 1 ? "Seat" : "Seats"} left
          </p>
        </div>
        <button className=" bg-(--primary) text-white rounded-lg font-bold p-2 px-4 cursor-pointer">
          Book seat
        </button>
      </div>
    </div>
  );
};

export default carpoolcard;
