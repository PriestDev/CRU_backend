// app/rider/page.tsx
"use client";

import { rides } from "@/app/(rider)/data";
import RideCard from "@/components/ui/rideCard";
import PageHeader from "@/components/layout/pageHeader"

export default function RiderDashboard() {
  return (
    <div className="">
      <div className="border-b border-(--stroke)">
        <PageHeader text="Dashboard" />
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-lg border border-(--stroke)/50 p-4 space-y-2">
        <p className="text-sm text-(--ash)">Today's Earnings</p>
        <h2 className="text-2xl font-bold text-(--primary)">₦12,450.00</h2>
        <p className="text-xs text-green-600">↑ 12% from yesterday</p>
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold">Recent Activity</h2>
        {rides.slice(0, 2).map((ride) => (
          <RideCard key={ride.id} {...ride} />
        ))}
      </div>
      </div>
    </div>
  );
}
