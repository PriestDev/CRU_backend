import React, { ReactNode } from "react";
import Nav from "@/components/layout/nav"

const studentLayout = ({ children }: { children: ReactNode }) => {
  return <html lang="en">
    <body className="">
        <div className="pb-30 bg-(--background) min-h-screen">
          {children}
        </div>
        <Nav/>
    </body>
  </html>;
};

export default studentLayout;
