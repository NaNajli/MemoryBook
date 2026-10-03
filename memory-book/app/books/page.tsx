import DashboardTabs from "../components/dashboard/DashboardTabs";
import SortableBooks from "../components/dashboard/SortableBooks";
import { connection } from "next/server";
import { loadBookCollection } from "@/lib/bookCollection";
import { getCurrentUserId } from "@/lib/currentUser";
import Navigation from "../components/navigation/Navigation";

export default async function BooksPage() {
  await connection();
  const { books, error } = await loadBookCollection(getCurrentUserId());
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
          <DashboardTabs activeTab="dashboard" />
          <SortableBooks books={books} error={error} />
        </div>
      </main>
    </>
  );
}
