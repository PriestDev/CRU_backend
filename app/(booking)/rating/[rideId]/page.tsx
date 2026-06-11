// app/review/[rideId]/page.tsx
"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import TextBox from "@/components/ui/textBox";

export default function ReviewPage({ params }: { params: { rideId: string } }) {
  const rideId = params.rideId;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Example dynamic data (replace with backend data)
  const ride = {
    driver: {
      name: "David Chen",
      image: "https://placehold.net/avatar-4.svg",
      title: "Campus Certified Driver",
    },
  };

  const handleRating = (value: number) => setRating(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ rideId, rating, comment });
    // send to backend or redirect
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-(--background) p-4 space-y-4">
      {/* Review Card */}
      <div className="bg-white rounded-lg border border-(--stroke)/50 p-4 space-y-4">
        <div>
          <h1 className="text-lg font-bold text-center">How was your ride?</h1>
          <p className="text-center text-(--ash)">
            Your feedback helps improve safety and reliability on campus.
          </p>
        </div>

        {/* Driver Info */}
        <div className="flex items-center gap-1">
          <img
            src={ride.driver.image}
            alt={ride.driver.name}
            className="rounded-full w-12 h-12"
          />
          <div>
            <p className="font-bold">{ride.driver.name || "Your Driver"}</p>
            <p className="text-(--ash)">
              {ride.driver.title || "Campus Certified Driver"}
            </p>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRating(star)}
              className={`material-symbols-outlined ${
                star <= rating ? "text-yellow-500" : "text-(--stroke)"
              }`}
            >
              star
            </button>
          ))}
        </div>

        {/* Comment Box */}
        <TextBox
          id="comment"
          label="Add a comment(optional)"
          placeholder="Tell us about your experience"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Submit Button */}
        <Button
          text="Submit rating"
          bgColor="primary"
          type="submit"
          onClick={() => handleSubmit}
        />

        {/* Skip Link */}
        <p className="text-center text-(--ash) cursor-pointer hover:text-(--primary)">
          Skip
        </p>
      </div>
    </div>
  );
}
