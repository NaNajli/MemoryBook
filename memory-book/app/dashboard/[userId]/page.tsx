import { getCurrentUserId } from "@/lib/currentUser";
import { notFound } from "next/navigation";
import BooksCard from "../../components/dashboard/BooksCard";
import { connection } from "next/server";
import { loadBookCollection } from "@/lib/bookCollection";
import pool from "@/lib/db";
import DashboardTabs from "../../components/dashboard/DashboardTabs";
import InviteCard from "../../components/dashboard/InviteCard";
import Navigation from "../../components/navigation/Navigation";

export default async function DashboardPage({ params }: { params: Promise<{ userId: string }> }) {
  await connection();
  const authenticatedUserId = await getCurrentUserId();
  const { userId: requestedId } = await params;
  const userId = Number(requestedId);
  if (!Number.isSafeInteger(userId) || userId <= 0 || userId !== authenticatedUserId) notFound();
  const user = await pool.query("SELECT name FROM users WHERE id = $1", [userId]);
  if (!user.rows.length) notFound();
  const { books, error } = await loadBookCollection(userId);
  return (
    <>
      <Navigation variant="authenticated" />
      <main className="dashboard-page">
        <div className="page-shell">
          <div className="dashboard-welcome">
            <div>
              <p className="eyebrow">Your family space</p>
              <h1>Welcome, {user.rows[0].name}!</h1>
              <p>Share stories, revisit moments, and keep your family&apos;s memories together.</p>
            </div>
            <span className="welcome-flourish" aria-hidden="true">♡</span>
          </div>

          <DashboardTabs activeTab="dashboard" userId={userId} />

          <div className="dashboard-grid">
            <InviteCard userId={userId} />
            <BooksCard books={books} error={error} />
          </div>
        </div>
      </main>
    </>
  );
}
