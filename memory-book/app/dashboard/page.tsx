import BooksCard, { type MemoryBookSummary } from "../components/dashboard/BooksCard";
import DashboardTabs from "../components/dashboard/DashboardTabs";
import InviteCard from "../components/dashboard/InviteCard";
import Navigation from "../components/navigation/Navigation";

// TODO: Load the account name, secure share URL, and books from the authenticated session/database.
const books: MemoryBookSummary[] = [];

export default function DashboardPage() {
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
            <BooksCard books={books} />
          </div>
        </div>
      </main>
    </>
  );
}
