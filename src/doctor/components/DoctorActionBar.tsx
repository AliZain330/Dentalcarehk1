import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DoctorActionBarProps {
  children: React.ReactNode;
}

const DoctorActionBar: React.FC<DoctorActionBarProps> = ({ children }) => (
  <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
    <div className="mx-auto max-w-lg px-4 py-3 space-y-2">
      {children}
    </div>
  </div>
);

export default DoctorActionBar;
