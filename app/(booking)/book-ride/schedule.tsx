"use client";

import Button from "@/components/ui/button";
import { useState } from "react";

const Schedule = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  return (
    <form className="space-y-4">
      {/* From / To */}
      <div className="flex gap-2 w-full">
        {" "}
        <div className="flex flex-col justify-around items-center">
          {" "}
          <div className=" w-2 h-2 rounded-full border-2 border-(--primary)"></div>{" "}
          <div className=" h-15 w-0.5 bg-(--stroke) rounded-full"></div>{" "}
          <span className="material-symbols-outlined text-(--primary)">
            {" "}
            location_pin{" "}
          </span>{" "}
        </div>{" "}
        <div className="flex flex-col justify-between gap-3 w-full">
          {" "}
          <div>
            {" "}
            <p className=" text-[10px] capitalize text-(--ash) font-bold">
              {" "}
              From{" "}
            </p>{" "}
            <input
              type="text"
              placeholder="Curent location"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full border border-(--stroke) rounded-lg bg-white p-2 focus:outline-(--primary)"
            />{" "}
          </div>{" "}
          <div>
            {" "}
            <p className=" text-[10px] capitalize text-(--ash) font-bold">
              To
            </p>{" "}
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Destination"
              className="w-full border border-(--stroke) rounded-lg bg-white p-2 focus:outline-(--primary)"
            />{" "}
          </div>{" "}
        </div>{" "}
      </div>

      {/* DATE & TIME */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] text-(--ash) font-bold">Date</p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-(--stroke) rounded-lg p-2"
          />
        </div>

        <div>
          <p className="text-[10px] text-(--ash) font-bold">Time</p>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-(--stroke) rounded-lg p-2"
          />
        </div>
      </div>

      {/* OPTIONAL NOTE */}
      <div>
        <p className="text-[10px] text-(--ash) font-bold">Note (optional)</p>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Pick me up at hostel gate"
          className="w-full border border-(--stroke) rounded-lg p-2 focus:outline-(--primary)"
        />
      </div>

      {/* INFO BOX */}
      <div className="text-xs text-(--ash) bg-(--primary)/5 p-2 rounded-lg">
        Scheduled rides will be assigned to a driver before your selected time.
      </div>

      <Button type="submit" bgColor="primary" text="Schedule Ride" />
    </form>
  );
};

export default Schedule;
