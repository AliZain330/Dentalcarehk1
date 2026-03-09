import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

const AppLayout: React.FC = () => {
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background">
      <main className="pb-[var(--bottom-nav-height)]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
