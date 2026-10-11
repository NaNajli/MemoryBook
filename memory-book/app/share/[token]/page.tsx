import { notFound } from "next/navigation";
import { connection } from "next/server";
import { resolveShareToken } from "@/lib/shareLinks";
import { loadBookCollection } from "@/lib/bookCollection";
import pool from "@/lib/db";
import DashboardTabs from "../../components/dashboard/DashboardTabs";
import BooksCard from "../../components/dashboard/BooksCard";

export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function SharedPage({ params }: { params: Promise<{ token: string }> }) {
  await connection();
  const { token } = await params;
  const userId = await resolveShareToken(token);
  if (userId === null) notFound();
  const user = await pool.query<{ name: string }>("SELECT name FROM users WHERE id = $1", [userId]);
  if (!user.rows.length) notFound();
  const { books, error } = await loadBookCollection(userId, token);
  return <main className="dashboard-page"><div className="page-shell">
    <h1>You are viewing {user.rows[0].name}&apos;s family memories</h1>
    <p>View these storybooks and add memories. No account needed.</p>
    <DashboardTabs activeTab="dashboard" shareToken={token} />
    <BooksCard books={books} error={error} />
  </div></main>;
}
