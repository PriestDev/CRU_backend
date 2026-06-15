"use client";

import PageHeader from "@/components/layout/pageHeader";
import { notifications } from "../data";
import { useState } from "react";
import Link from "next/link";
import AlertCard from "@/components/ui/alertcard";

const page = () => {
  const [section, setSection] = useState<
    "all" | "rides" | "delivery" | "promos" | "system"
  >("all");
  const rideAlerts = notifications.filter(
    (notification) => notification.type === "ride",
  );
  const deliveryAlerts = notifications.filter(
    (notification) => notification.type === "delivery",
  );
  const promoAlerts = notifications.filter(
    (notification) => notification.type === "promo",
  );
  const systemAlerts = notifications.filter(
    (notification) => notification.type === "system",
  );
  return (
    <div>
      <div className="border-b border-(--stroke)">
        <PageHeader
          text="Alerts"
          extra={
            <span className="material-symbols-outlined text-(--primary)">
              done_all
            </span>
          }
        />
      </div>

      <div className="border-b border-(--stroke) px-4 text-(--lightText) grid grid-cols-5">
        <button
          className={`py-4 border-b-2 ${section === "all" ? " border-(--primary) font-bold text-(--primary)" : "border-transparent"}`}
          onClick={() => setSection("all")}
        >
          All
        </button>
        <button
          className={`py-4 border-b-2 ${section === "rides" ? "border-(--primary) font-bold text-(--primary)" : "border-transparent"}`}
          onClick={() => setSection("rides")}
        >
          Rides
        </button>
        <button
          className={`py-4 border-b-2 ${section === "delivery" ? "border-(--primary) font-bold text-(--primary)" : "border-transparent"}`}
          onClick={() => setSection("delivery")}
        >
          Delivery
        </button>
        <button
          className={`py-4 border-b-2 ${section === "promos" ? "border-(--primary) font-bold text-(--primary)" : "border-transparent"}`}
          onClick={() => setSection("promos")}
        >
          Promos
        </button>
        <button
          className={`py-4 border-b-2 ${section === "system" ? "border-(--primary) font-bold text-(--primary)" : "border-transparent"}`}
          onClick={() => setSection("system")}
        >
          System
        </button>
      </div>

      <div className="">
        {section === "all" &&
          notifications.map((notification, index) => (
            <AlertCard
              title={notification.title}
              message={notification.message}
              time={notification.time}
              type={notification.type}
              isRead={notification.isRead}
            />
          ))}
        {section === "rides" &&
          rideAlerts.map((notification, index) => (
            <AlertCard
              title={notification.title}
              message={notification.message}
              time={notification.time}
              type={notification.type}
              isRead={notification.isRead}
            />
          ))}
        {section === "delivery" &&
          deliveryAlerts.map((notification, index) => (
            <AlertCard
              title={notification.title}
              message={notification.message}
              time={notification.time}
              type={notification.type}
              isRead={notification.isRead}
            />
          ))}
        {section === "promos" &&
          promoAlerts.map((notification, index) => (
            <AlertCard
              title={notification.title}
              message={notification.message}
              time={notification.time}
              type={notification.type}
              isRead={notification.isRead}
            />
          ))}
        {section === "system" &&
          systemAlerts.map((notification, index) => (
            <AlertCard
              title={notification.title}
              message={notification.message}
              time={notification.time}
              type={notification.type}
              isRead={notification.isRead}
            />
          ))}
      </div>
    </div>
  );
};

export default page;
