import BooksCard from "../components/dashboard/BooksCard";
import { connection } from "next/server";
import { loadBookCollection } from "@/lib/bookCollection";
import { getCurrentUserId } from "@/lib/currentUser";
import DashboardTabs from "../components/dashboard/DashboardTabs";
import InviteCard from "../components/dashboard/InviteCard";
import Navigation from "../components/navigation/Navigation";

export default async function DashboardPage() {
  await connection();
  const { books, error } = await loadBookCollection(getCurrentUserId());
  return (
    <>
      <Navigation variant="authenticated" />
      <main className="dashboard-page">
        <div className="page-shell">
          <div className="dashboard-welcome">
            <div>
              <p className="eyebrow">Your family space</p>
              <h1>Welcome, User!</h1>
              <p>Share stories, revisit moments, and keep your family&apos;s memories together.</p>
            </div>
            <span className="welcome-flourish" aria-hidden="true">♡</span>
          </div>

          <DashboardTabs activeTab="dashboard" />

          <div className="dashboard-grid">
            <InviteCard />
            <BooksCard books={books} error={error} />
          </div>
        </div>
      </main>
    </>
  );
}
