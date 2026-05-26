"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 text-center bg-white">
      {/* Illustration */}
      <svg
        className="mb-8 opacity-15"
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
      >
        <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2" />
        <path
          d="M26 30 Q40 20 54 30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="30" cy="42" r="4" fill="currentColor" />
        <circle cx="50" cy="42" r="4" fill="currentColor" />
        <path
          d="M28 56 Q40 50 52 56"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* 404 */}
      <h1 className="text-[96px] font-medium leading-none tracking-[-4px] mb-6 text-(--primary)">
        404
      </h1>

      {/* Divider */}
      <div className="w-10 h-0.5 rounded-full mb-6 bg-(--primary)" />

      {/* Text */}
      <p className="text-lg font-medium text-gray-900 mb-3">Page not found</p>
      <p className="text-sm text-gray-500 leading-relaxed max-w-65 mx-auto mb-10">
        The page you're looking for doesn't exist or has been moved.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full">
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 p-3.5 rounded-lg font-bold text-white transition-opacity hover:opacity-90 bg-(--primary) text-base"
        >
          Go home
        </Link>
        <Button
          text="Go back"
          type="button"
          className="text-(--lightText) border border-(--stroke)"
          onClick={() => router.back()}
        />
      </div>
    </div>
  );
}
