"use client";

// Force rebuild - now with allowImportingTsExtensions
import Button from "@/components/ui/button";
import Link from "next/link";
import { services, trips } from "../data.tsx";
import TripCard from "@/components/ui/tripcard";

const page = () => {
  const displayedTrips = trips.slice(0, 3);
  return (
    <>
      {/* page header */}
      <div className="flex items-center justify-between p-4 border-b border-(--primary)/10">
        <span className="material-symbols-outlined text-(--primary) bg-(--primary)/10 rounded-full p-2">
          account_circle
        </span>
        <h4 className="text-lg font-extrabold">CampusRide</h4>
        <span className="material-symbols-outlined text-(--primary) bg-(--primary)/10 rounded-full p-2">
          help
        </span>
      </div>
      {/* main body */}
      <main className="space-y-4 px-4">
        <section className="space-y-4 py-4">
          {/* search bar */}
          <div className="">
            <div className="flex items-center bg-white rounded-xl border border-(--primary)/10 p-4 gap-4 placeholder:font-bold placeholder:text-(--ash)">
              <span className="material-symbols-outlined text-(--primary)">
                search
              </span>
              <input
                type="text"
                placeholder="Where to?"
                className="w-full focus:outline-0 focus:border-0"
              />
            </div>
          </div>
          {/* carpooling CTA */}
          <section className="bg-(--primary) p-6 rounded-xl text-white space-y-2">
            <h4 className=" font-bold text-lg">Save with Carpooling</h4>
            <p className=" text-white/80">
              Share your commute with fellow students and split the costs.
            </p>
            <button className="bg-white text-(--primary) font-bold p-4 py-2 rounded-lg">
              <Link href="/carpool">Start Saving</Link>
            </button>
          </section>
        </section>
        {/* services section */}
        <section className=" space-y-4">
          <h4 className="text-lg font-bold">Shuttle Services</h4>
          <div className="grid grid-cols-4 gap-10">
            {services.map((service, index) => (
              <Link
                href={service.link}
                key={index}
                className="flex flex-col gap-1.5 items-center"
              >
                <div className="text-(--primary) bg-(--primary)/10 w-15 h-15 rounded-2xl  flex items-center justify-center">
                  {service.icon}
                </div>
                <p className="font-semibold text-nowrap">{service.name}</p>
              </Link>
            ))}
          </div>
        </section>
        {/* recent trips */}
        <section>
          <div className="flex items-center justify-between py-4">
            <h4 className="text-lg font-bold">Recent Trips</h4>
            <Link href="/activity" className="text-(--primary) font-bold">
              See all
            </Link>
          </div>
          <div className="space-y-4">
            {displayedTrips.map((trip, index) => (
              <div key={index}>
                <TripCard
                  from={trip.from}
                  to={trip.to}
                  date={trip.date}
                  time={trip.time}
                  status={trip.status}
                  price={trip.price}
                  type={trip.type}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default page;
