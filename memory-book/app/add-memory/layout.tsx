"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardTabs from "../components/dashboard/DashboardTabs";
import Navigation from "../components/navigation/Navigation";

function AddMemoryShell({ children }: { children: React.ReactNode }) {
  const shareToken = useSearchParams()?.get("share") ?? undefined;
  return (
    <>
      <Navigation variant="authenticated" />
      <div className="add-memory-tabs-shell">
        <div className="page-shell">
          <DashboardTabs activeTab="add-memory" shareToken={shareToken} />
        </div>
      </div>
      {children}
    </>
  );
}

export default function AddMemoryLayout({ children }: { children: React.ReactNode }) {
  return <Suspense><AddMemoryShell>{children}</AddMemoryShell></Suspense>;
}
