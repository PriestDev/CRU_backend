// app/(student)/data.tsx

export interface transactionProps {
  type: "payment" | "topup" | "withdraw";
  title: string;
  date: string;
  time: string;
  amount: string;
  status: "success" | "processing" | "failed";
}

export const transactions: transactionProps[] = [
  {
    type: "payment",
    title: "Ride Payment • To Main Gate",
    date: "Today",
    time: "2:45 PM",
    amount: "-₦450.00",
    status: "success",
  },
  {
    type: "topup",
    title: "Wallet Top-up • via Card",
    date: "Yesterday",
    time: "11:20 AM",
    amount: "+₦5,000.00",
    status: "success",
  },
  {
    type: "withdraw",
    title: "Withdrawal to Bank • GTBank",
    date: "Oct 24",
    time: "09:15 AM",
    amount: "-₦2,000.00",
    status: "processing",
  },
  {
    type: "payment",
    title: "Ride Payment • To Faculty",
    date: "Oct 22",
    time: "4:10 PM",
    amount: "-₦300.00",
    status: "failed",
  },
];
