"use client";

import PageHeader from "@/components/layout/pageHeader";
import CarpoolCard from "@/components/ui/carpoolcard";
import { carpoolTrips } from "../data";

const page = () => {
  return (
    <div>
      <div className="border-b border-(--stroke)">
        <PageHeader text="Carpooling" />
      </div>
      <div className="p-4 space-y-2">
        {carpoolTrips.map((carpool, index) => (
          <div key={index}>
            <CarpoolCard
              id={carpool.id}
              driverName={carpool.driverName}
              driverImage={carpool.driverImage}
              rating={carpool.rating}
              totalRides={carpool.totalRides}
              from={carpool.from}
              to={carpool.to}
              departureTime={carpool.departureTime}
              arrivalTime={carpool.arrivalTime}
              pricePerSeat={carpool.pricePerSeat}
              seatsLeft={carpool.seatsLeft}
              vehicleType={carpool.vehicleType}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
