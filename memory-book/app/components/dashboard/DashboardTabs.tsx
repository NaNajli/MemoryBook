import Link from "next/link";

type DashboardTabsProps = {
  activeTab: "dashboard" | "add-memory";
};

export default function DashboardTabs({ activeTab }: DashboardTabsProps) {
  return (
    <nav className="dashboard-tabs" aria-label="Dashboard sections">
      <Link
        className={activeTab === "dashboard" ? "dashboard-tab is-active" : "dashboard-tab"}
        href="/dashboard"
        aria-current={activeTab === "dashboard" ? "page" : undefined}
      >
        Dashboard
      </Link>
      <Link
        className={activeTab === "add-memory" ? "dashboard-tab is-active" : "dashboard-tab"}
        href="/add-memory"
        aria-current={activeTab === "add-memory" ? "page" : undefined}
      >
        Add New Memory
      </Link>
    </nav>
  );
}
