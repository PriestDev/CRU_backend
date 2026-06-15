"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const RiderNav = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 right-0 left-0 m-4 bg-white/80 rounded-lg shadow-xs border border-(--stroke)/30 flex items-center justify-around p-4 text-(--lightText) backdrop-blur-sm">
      {/* Dashboard */}
      <Link
        href="/dashboard"
        className={`flex flex-col items-center ${
          pathname === "/dashboard" && "text-(--primary) font-semibold"
        }`}
      >
        <span className="material-symbols-outlined">dashboard</span>
        <p>Dashboard</p>
      </Link>

      {/* Available Rides */}
      <Link
        href="/available-rides"
        className={`flex flex-col items-center ${
          pathname === "/available-rides" && "text-(--primary) font-semibold"
        }`}
      >
        <span className="material-symbols-outlined">directions_car</span>
        <p>Rides</p>
      </Link>

      {/* Ride History */}
      <Link
        href="/history"
        className={`flex flex-col items-center ${
          pathname === "/history" && "text-(--primary) font-semibold"
        }`}
      >
        <span className="material-symbols-outlined">history</span>
        <p>History</p>
      </Link>

      {/* Wallet */}
      {/* <Link
        href="/wallet"
        className={`flex flex-col items-center ${
          pathname === "/wallet" && "text-(--primary) font-semibold"
        }`}
      >
        <span className="material-symbols-outlined">wallet</span>
        <p>Wallet</p>
      </Link> */}

      {/* Profile */}
      <Link
        href="/profile"
        className={`flex flex-col items-center ${
          pathname.startsWith("/rider-profile") && "text-(--primary) font-semibold"
        }`}
      >
        <span className="material-symbols-outlined">person</span>
        <p>Profile</p>
      </Link>
    </div>
  );
};

export default RiderNav;
