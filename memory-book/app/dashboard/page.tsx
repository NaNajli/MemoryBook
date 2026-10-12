import DashboardClient from "./DashboardClient";
import BooksCard from "../components/dashboard/BooksCard";
import { connection } from "next/server";
import { loadBookCollection } from "@/lib/bookCollection";
import { getCurrentUserId } from "@/lib/currentUser";

export default async function DashboardPage() {
  await connection();

  const { books, error } = await loadBookCollection(
    getCurrentUserId()
  );

  return (
    <DashboardClient>
      <Navigation variant="authenticated" />

      <main className="dashboard-page">
        <div className="page-shell">
          <div className="dashboard-welcome">
            <div>
              <p className="eyebrow">Your family space</p>
              <h1>Welcome, User!</h1>
              <p>
                Share stories, revisit moments, and keep your family's memories
                together.
              </p>
            </div>

            <span className="welcome-flourish" aria-hidden="true">
              ♡
            </span>
          </div>

          <DashboardTabs activeTab="dashboard" />

          <div className="dashboard-grid">
            <InviteCard />
            <BooksCard books={books} error={error} />
          </div>
        </div>
      </main>
    </DashboardClient>
  );
}
