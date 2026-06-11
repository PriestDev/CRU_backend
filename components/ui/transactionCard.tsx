// components/TransactionCard.tsx
"use client";

import { transactionProps } from "@/app/wallet/data";

const TransactionCard = (props: transactionProps) => {
  return (
    <div className="flex items-center justify-between gap-2 p-4 bg-white rounded-lg border border-(--stroke)/10 shadow-xs">
      {/* Left section: icon + details */}
      <div className="flex items-center gap-2">
        <div className="text-(--primary) bg-(--primary)/10 rounded-lg flex items-center justify-center w-10 h-10 shrink-0">
          {props.type === "payment" ? (
            <span className="material-symbols-outlined">directions_car</span>
          ) : props.type === "topup" ? (
            <span className="material-symbols-outlined">account_balance_wallet</span>
          ) : (
            <span className="material-symbols-outlined">payments</span>
          )}
        </div>
        <div>
          <h4 className="font-bold line-clamp-1">{props.title}</h4>
          <p className="text-(--lightText) line-clamp-1">
            {props.date} ▪️ {props.time}
          </p>
        </div>
      </div>

      {/* Right section: amount + status */}
      <div className="flex flex-col items-end">
        <h4
          className={`font-bold ${
            props.amount.startsWith("-") ? "text-red-500" : "text-green-600"
          }`}
        >
          {props.amount}
        </h4>
        <p
          className={`text-[10px] rounded-lg p-1 px-2 capitalize ${
            props.status === "success"
              ? "text-green-500 bg-green-100"
              : props.status === "processing"
              ? "text-yellow-500 bg-yellow-100"
              : "text-red-500 bg-red-100"
          }`}
        >
          {props.status}
        </p>
      </div>
    </div>
  );
};

export default TransactionCard;
