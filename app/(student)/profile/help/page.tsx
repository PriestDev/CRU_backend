"use client";

import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button";
import { faqs } from "./data";
import { useState } from "react";

const page = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="border-b border-(--stroke)">
        <PageHeader text="Help & Support" />
      </div>
      <div></div>
      <div className="p-4 space-y-4">
        {/* contact support */}
        <div className="space-y-2">
          <h4 className="font-bold uppercase text-(--lightText) tracking-wider">
            Quick Actions
          </h4>
          <div className="">
            {[
              // { title: "Live Chat", icon: "chat" },
              { title: "Report Issues", icon: "report" },
            ].map((action, index) => (
              <div
                className="bg-white rounded-lg p-4 flex flex-col items-center gap-1 cursor-pointer"
                key={index}
              >
                <span className="material-symbols-outlined bg-(--primary)/10 rounded-full p-2">
                  {action.icon}
                </span>
                <p className="font-semibold">{action.title}</p>
              </div>
            ))}
          </div>
        </div>
        {/* faq */}
        <div className="space-y-2">
          <h4 className="font-bold uppercase text-(--lightText) tracking-wider">
            Common questions
          </h4>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 flex flex-col gap-2"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  <h4 className="font-semibold">{faq.question}</h4>
                  <span className="material-symbols-outlined text-(--lightText)">
                    keyboard_arrow_down
                  </span>
                </div>
                <p className={expandedIndex === index ? "block" : "hidden"}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* email support */}
        {/* <div className="bg-(--primary) text-white rounded-lg p-4 py-8 space-y-2">
          <h4 className="text-sm font-bold">Still need help?</h4>
          <p className="text-white/50">
            Our support team is available 24/7 for campus emergencies and ride
            assistance.
          </p>
          <Button
            text="Email Support"
            bgColor="white"
            type="button"
            className="text-(--primary)"
          />
        </div> */}
      </div>
    </div>
  );
};

export default page;
