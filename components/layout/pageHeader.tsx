import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

type headerProps = {
  text: string;
  extra?: React.ReactNode;
};

const pageHeader = ({ text, extra }: headerProps) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between p-4 py-4">
      <FaArrowLeft onClick={() => router.back()} className=" text-lg" />
      <h4 className="font-bold text-lg">{text}</h4>
      <div>{extra}</div>
    </div>
  );
};

export default pageHeader;
