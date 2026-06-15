// app/wallet/fund/page.tsx
"use client";

import Button from "@/components/ui/button";
import PageHeader from "@/components/layout/pageHeader";

export default function FundWallet() {
  return (
    <div className="min-h-screen bg-(--background)">
      <div className="border-b border-(--stroke)">
        <PageHeader text="Fund Wallet" />
      </div>
      <div className="bg-white rounded-lg border border-(--stroke)/50 p-4 space-y-4">
        <div className="space-y-2">
          <h4 className="text-xl font-bold">Fund wallet</h4>
          <p className=" text-(--ash)">
            Add money to your wallet using your card.
          </p>
        </div>

        <input
          type="number"
          placeholder="Enter amount (₦)"
          className="w-full border border-(--stroke) rounded-lg p-2 focus:outline-(--primary)"
        />

        <Button text="Proceed to Payment" bgColor="primary" type="submit" />
      </div>
    </div>
  );
}
