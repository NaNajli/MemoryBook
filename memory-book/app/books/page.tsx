import DashboardTabs from "../components/dashboard/DashboardTabs";
import SortableBooks from "../components/dashboard/SortableBooks";
import type { MemoryBookSummary } from "../components/dashboard/BooksCard";
import Navigation from "../components/navigation/Navigation";

// TODO: Replace with books loaded for the authenticated account.
const books: MemoryBookSummary[] = [];

export default function BooksPage() {
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
