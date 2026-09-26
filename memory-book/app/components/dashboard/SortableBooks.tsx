"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MemoryBookSummary } from "./BooksCard";

type SortableBooksProps = {
  books: MemoryBookSummary[];
};

export default function SortableBooks({ books }: SortableBooksProps) {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const sortedBooks = useMemo(
    () => [...books].sort((a, b) => sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)),
    [books, sortDirection],
  );

  return (
    <section className="all-books-panel" aria-labelledby="all-books-heading">
      <div className="all-books-toolbar">
        <h2 id="all-books-heading">All books</h2>
        <label>
          Sort by
          <select value={sortDirection} onChange={(event) => setSortDirection(event.target.value as "asc" | "desc")}>
            <option value="asc">Name: A–Z</option>
            <option value="desc">Name: Z–A</option>
          </select>
        </label>
      </div>

      {sortedBooks.length > 0 ? (
        <ul className="all-books-grid">
          {sortedBooks.map((book) => (
            <li key={book.id}>
              <Link href={`/books/${book.id}`}>
                <span className="all-books-cover" aria-hidden="true">MB</span>
                <strong>{book.name}</strong>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="books-empty-state compact-empty-state">
          <h3>No memory books yet</h3>
          <p>Books will appear here once the database is connected.</p>
        </div>
      )}
    </section>
  );
}
