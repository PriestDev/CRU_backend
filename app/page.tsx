'use client'

import Image from "next/image";
import Illustration from "../assets/undraw_order-ride_4gaq.svg";
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const splashScreen = setTimeout(() => {router.replace('/signup')}, 2000)
    return () => clearTimeout(splashScreen)
  })
  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-(--background) h-screen space-y-6">
      <Image
        src={Illustration}
        alt="Order ride illustration"
        width={400}
        height={500}
      />
      <div>
        <h1 className="text-2xl font-bold text-center text-(--primary)">
          Welcome to Campus Ride
        </h1>
        <p className="text-center">
          The most reliable way to navigate you campus effortlessly and safely.
        </p>
      </div>
    </main>
  );
}
