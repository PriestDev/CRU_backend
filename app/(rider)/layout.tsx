import { ReactNode } from "react";
import RiderNav from "@/components/layout/riderNav";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-(--background)">
      {children}
      <RiderNav />
    </div>
  );
};

export default layout;
