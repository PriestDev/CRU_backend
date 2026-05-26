import { ReactNode } from "react";
import Nav from "@/components/layout/nav";

const studentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="pb-30 bg-(--background) min-h-screen">{children}</div>
      <Nav />
    </>
  );
};

export default studentLayout;
