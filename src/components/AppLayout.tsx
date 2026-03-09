import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

const AppLayout: React.FC = () => {
  const location = useLocation();

  // Pages that have their own fixed bottom action bars — don't add nav padding
  const hasBottomBar = [
    /^\/institution\/.+/,
    /^\/booking\//,
    /^\/consultation\//,
    /^\/order\/.+/,
    /^\/report\/.+/,
  ].some((r) => r.test(location.pathname));

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background">
      <main className={hasBottomBar ? "" : "pb-[var(--bottom-nav-height)]"}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
