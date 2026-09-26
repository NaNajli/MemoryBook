import DashboardTabs from "../components/dashboard/DashboardTabs";
import Navigation from "../components/navigation/Navigation";

export default function AddMemoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation variant="authenticated" />
      <div className="add-memory-tabs-shell">
        <div className="page-shell">
          <DashboardTabs activeTab="add-memory" />
        </div>
      </div>
      {children}
    </>
  );
}
