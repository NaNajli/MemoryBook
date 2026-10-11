import DashboardTabs from "../components/dashboard/DashboardTabs";
import SortableBooks from "../components/dashboard/SortableBooks";
import { connection } from "next/server";
import { loadBookCollection } from "@/lib/bookCollection";
import { resolveCollectionUser } from "@/lib/shareLinks";
import { notFound } from "next/navigation";
import Navigation from "../components/navigation/Navigation";

export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function BooksPage({ searchParams }: { searchParams: Promise<{ share?: string; userId?: string }> }) {
  await connection();
  const { share, userId: legacyId } = await searchParams;
  if (legacyId !== undefined) notFound();
  const userId = await resolveCollectionUser(share);
  if (userId === null) notFound();
  const { books, error } = await loadBookCollection(userId, share);
  return (
    <>
      <Navigation variant="authenticated" />
      <main className="dashboard-page">
        <div className="page-shell">
          <div className="books-page-heading">
            <p className="eyebrow">Your collection</p>
            <h1>All Memory Books</h1>
            <p>Browse and sort every memory book in your family collection.</p>
          </div>
          <DashboardTabs activeTab="dashboard" userId={userId} shareToken={share} />
          <SortableBooks books={books} error={error} />
        </div>
      </main>
    </>
  );
}
