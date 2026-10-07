"use client";

import Link from "next/link";
import { CollectionDownloadActions, useCollectionDownload } from "./CollectionDownload";

import type { MemoryBookSummary } from "@/lib/bookCollection";

type BooksCardProps = {
  books: MemoryBookSummary[];
  error?: boolean;
};

export default function BooksCard({ books, error = false }: BooksCardProps) {
  const download = useCollectionDownload();

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

      {error ? (
        <div className="books-empty-state" role="alert">
          <h3>Unable to load your collection</h3>
          <p>Please refresh the page to try again.</p>
        </div>
      ) : books.length > 0 ? (
        <ul className="dashboard-book-list">
          {books.map((book) => (
            <li key={book.id} className={download.selecting ? "collection-selectable" : undefined}>
              {download.selecting && (
                <input type="checkbox" aria-label={`Select ${book.name} in ${book.bookTitle}`}
                  checked={download.selected.includes(book.id)} disabled={download.busy}
                  onChange={() => download.toggle(book.id)} />
              )}
              <Link href={book.href}>
                <span className="book-spine" aria-hidden="true" />
                <span className="book-list-copy">
                  <strong>{book.name}</strong>
                  <span>{book.bookTitle}</span>
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
          <p>Add a memory to start your collection.</p>
        </div>
      )}
      {!error && books.length > 0 && <CollectionDownloadActions state={download} />}
    </section>
  );
}