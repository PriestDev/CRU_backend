"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const nav = () => {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 right-0 left-0 m-4 bg-white/80 rounded-2xl shadow-xs border border-(--ash)/30 flex items-center justify-around p-4 gap-2 text-(--grey) text-sm backdrop-blur-sm">
      {/* home button */}
      <Link
        href="/home"
        className={`flex flex-col items-center gap-1.5 ${pathname === "/home" && "text-(--primary) font-semibold"}`}
      >
        <span className="material-symbols-outlined text-2xl">home</span>
        <p className="">Home</p>
      </Link>

      {/* activities button */}
      <Link
        href="/activity"
        className={`flex flex-col items-center gap-1.5 ${pathname === "/activity" && "text-(--primary) font-semibold"}`}
      >
        <span className="material-symbols-outlined text-2xl">history</span>
        <p className="">Activity</p>
      </Link>

      {/* alerts button */}
      <Link
        href="/alert"
        className={`flex flex-col items-center gap-1.5 ${pathname === "/alert" && "text-(--primary) font-semibold"}`}
      >
        <span className="material-symbols-outlined text-2xl">
          notifications
        </span>
        <p className="">Alert</p>
      </Link>

      {/* profile button */}
      <Link
        href="/profile"
        className={`flex flex-col items-center gap-1.5 ${pathname === "/profile" || pathname === "/profile/personal-info" || pathname === "/profile/emergency-contacts" || pathname === "/profile/help" || pathname === "/profile/privacy-policy" ? "text-(--primary) font-semibold" : ""}`}
      >
        <span className="material-symbols-outlined text-2xl">person</span>
        <p className="">Profile</p>
      </Link>
    </div>
  );
};

export default nav;
