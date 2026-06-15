"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const nav = () => {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 right-0 left-0 m-4 bg-white/80 rounded-lg shadow-xs border border-(--stroke)/30 flex items-center justify-around p-4 text-(--lightText) backdrop-blur-sm">
      {/* home button */}
      <Link
        href="/home"
        className={`flex flex-col items-center ${pathname === "/home" && "text-(--primary) font-semibold"}`}
      >
        <span className="material-symbols-outlined">home</span>
        <p className="">Home</p>
      </Link>

      {/* activities button */}
      <Link
        href="/activity"
        className={`flex flex-col items-center ${pathname === "/activity" && "text-(--primary) font-semibold"}`}
      >
        <span className="material-symbols-outlined">history</span>
        <p className="">Activity</p>
      </Link>

      {/* Wallet button */}
      <Link
        href="/wallet"
        className={`flex flex-col items-center ${pathname === "/wallet" && "text-(--primary) font-semibold"}`}
      >
        <span className="material-symbols-outlined">wallet</span>
        <p className="">Wallet</p>
      </Link>

      {/* alerts button */}
      <Link
        href="/alert"
        className={`flex flex-col items-center ${pathname === "/alert" && "text-(--primary) font-semibold"}`}
      >
        <span className="material-symbols-outlined">notifications</span>
        <p className="">Alert</p>
      </Link>

      {/* profile button */}
      <Link
        href="/profile"
        className={`flex flex-col items-center ${pathname === "/profile" || pathname === "/profile/personal-info" || pathname === "/profile/emergency-contacts" || pathname === "/profile/help" || pathname === "/profile/privacy-policy" ? "text-(--primary) font-semibold" : ""}`}
      >
        <span className="material-symbols-outlined">person</span>
        <p className="">Profile</p>
      </Link>
    </div>
  );
};

export default nav;
