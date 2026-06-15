// app/wallet/withdraw/page.tsx
"use client";

import Button from "@/components/ui/button";
import PageHeader from "@/components/layout/pageHeader";

export default function WithdrawWallet() {
  return (
    <div className="min-h-screen bg-(--background)">
      <div className="border-b border-(--stroke)">
        <PageHeader text="Withdraw" />
      </div>
      <div className="bg-white rounded-lg border border-(--stroke)/50 p-4 space-y-4">
        <div className="space-y-2">
          <h4 className="text-xl font-bold">Withdraw Funds</h4>
          <p className=" text-(--ash)">
            Transfer money from your wallet to your bank account.
          </p>
        </div>

        <input
          type="number"
          placeholder="Enter amount (₦)"
          className="w-full border border-(--stroke) rounded-lg p-2 focus:outline-(--primary)"
        />

        <input
          type="text"
          placeholder="Bank Name"
          className="w-full border border-(--stroke) rounded-lg p-2 focus:outline-(--primary)"
        />

        <input
          type="text"
          placeholder="Account Number"
          className="w-full border border-(--stroke) rounded-lg p-2 focus:outline-(--primary)"
        />

        <Button text="Confirm Withdrawal" bgColor="primary" type="submit" />
      </div>
    </div>
  );
}
