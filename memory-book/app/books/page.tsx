import DashboardTabs from "../components/dashboard/DashboardTabs";
import SortableBooks from "../components/dashboard/SortableBooks";
import type { MemoryBookSummary } from "../components/dashboard/BooksCard";
import Navigation from "../components/navigation/Navigation";
import { getMemoryBooks } from "@/lib/getBooks";

// TODO: Replace with books loaded for the authenticated account.

export default async function BooksPage() {
  const databaseBooks = await getMemoryBooks();

  const books: MemoryBookSummary[] = databaseBooks.map((book) => ({
    id: String(book.id),
    name: book.title,
    updatedAt: new Date(book.created_at).toLocaleDateString(),
  }));

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

          <SortableBooks books={books} />
        </div>
      </main>
    </>
  );
}
