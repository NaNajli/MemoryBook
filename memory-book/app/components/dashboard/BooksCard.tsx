import Link from "next/link";

export type MemoryBookSummary = {
  id: string;
  name: string;
  updatedAt?: string;
};

type BooksCardProps = {
  books: MemoryBookSummary[];
};

export default function BooksCard({ books }: BooksCardProps) {
  const visibleBooks = books.slice(0, 5);

  return (
    <section className="dashboard-card books-card" aria-labelledby="books-heading">
      <div className="dashboard-card-heading books-heading-row">
        <div className="books-heading-title">
          <span className="dashboard-card-icon dashboard-card-icon-rose" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <path d="M6 7h9a4 4 0 0 1 4 4v16h-9a4 4 0 0 1-4-4V7Z" />
              <path d="M19 11a4 4 0 0 1 4-4h3v16a4 4 0 0 0-4 4h-3" />
            </svg>
          </span>
          <div>
            <p className="dashboard-kicker">Your collection</p>
            <h2 id="books-heading">Memory Books</h2>
          </div>
        </div>
        {books.length > 5 && <Link className="see-more-link" href="/books">See More <span aria-hidden="true">→</span></Link>}
      </div>

      {visibleBooks.length > 0 ? (
        <ul className="dashboard-book-list">
          {visibleBooks.map((book) => (
            <li key={book.id}>
              <Link href={`/books/${book.id}`}>
                <span className="book-spine" aria-hidden="true" />
                <span className="book-list-copy">
                  <strong>{book.name}</strong>
                  {book.updatedAt && <span>Updated {book.updatedAt}</span>}
                </span>
                <span className="book-list-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="books-empty-state">
          <span className="empty-book-illustration" aria-hidden="true">
            <svg viewBox="0 0 90 70">
              <path d="M11 13h27a12 12 0 0 1 12 12v34H23a12 12 0 0 1-12-12V13Z" />
              <path d="M50 25a12 12 0 0 1 12-12h17v34a12 12 0 0 0-12 12H50" />
              <path d="M21 25h17M21 33h12M62 25h8" />
            </svg>
          </span>
          <h3>Your memory books will appear here</h3>
          <p>This section is ready to display book records once the database is connected.</p>
        </div>
      )}
    </section>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 5b1b7efa70c1f406408acbce3878f787893b48b8
