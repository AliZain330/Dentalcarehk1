import React from "react";

interface DoctorEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

const DoctorEmptyState: React.FC<DoctorEmptyStateProps> = ({ icon, title, description }) => (
  <div className="py-16 text-center">
    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
      {icon}
    </div>
    <p className="text-sm font-medium text-muted-foreground">{title}</p>
    {description && <p className="mt-1 text-xs text-muted-foreground/70">{description}</p>}
  </div>
);

export default DoctorEmptyState;
