// app/wallet/page.tsx
"use client";

import TransactionCard from "@/components/ui/transactionCard";
import { transactions } from "@/app/wallet/data";
import Button from "@/components/ui/button";
import PageHeader from "@/components/layout/pageHeader";
import Nav from "@/components/layout/nav"
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-(--background)">
      <div className="border-b border-(--stroke)">
        <PageHeader text="Wallet" />
      </div>
      <div className="p-4 space-y-4">
        {/* Balance */}
        <div className="bg-(--primary) text-white rounded-lg p-4 space-y-4">
          <p className="opacity-80 font-bold">TOTAL BALANCE</p>
          <h1 className="text-3xl font-black">₦12,500.00</h1>
          <p className="opacity-80">Available for rides & withdrawals</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            text="Fund"
            bgColor="primary"
            type="button"
            onClick={() => router.push("/wallet/fund")}
          />
          <Button
            text="Withdraw"
            bgColor="white"
            type="button"
            onClick={() => router.push("/wallet/withdraw")}
          />
        </div>

        {/* Transactions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Transactions</h2>
            <p>View all</p>
          </div>
          {transactions.map((tx, i) => (
            <TransactionCard key={i} {...tx} />
          ))}
        </div>
      </div>

      <Nav/>
    </div>
  );
}
