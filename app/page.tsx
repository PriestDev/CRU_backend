"use client";

import Image from "next/image";
import Illustration from "../assets/undraw_order-ride_4gaq.svg";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-(--background) h-screen space-y-10 p-4">
      <Image
        src={Illustration}
        alt="Order ride illustration"
        width={400}
        height={500}
        className="p-15 pb-0"
      />
      <div className="space-y-3">
        <h1 className="text-xl font-bold text-center text-(--primary)">
          Welcome to Campus Ride
        </h1>
        <p className="text-center">
          The most reliable way to navigate you campus effortlessly and safely.
        </p>
        <Button
          text="Get Started"
          type="button"
          onClick={() => router.push("/signup")}
          bgColor="primary"
        />
      </div>
    </main>
  );
}
