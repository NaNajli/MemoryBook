"use client";

import Link from "next/link";
import { CollectionDownloadActions, useCollectionDownload } from "./CollectionDownload";
import { useMemo, useState } from "react";
import type { MemoryBookSummary } from "@/lib/bookCollection";

type SortableBooksProps = {
  books: MemoryBookSummary[];
  error?: boolean;
};

export default function SortableBooks({ books, error = false }: SortableBooksProps) {
  const download = useCollectionDownload();
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

      {error ? (
        <div className="books-empty-state compact-empty-state" role="alert">
          <h3>Unable to load your collection</h3>
          <p>Please refresh the page to try again.</p>
        </div>
      ) : sortedBooks.length > 0 ? (
        <ul className="all-books-grid">
          {sortedBooks.map((book) => (
            <li key={book.id} className={download.selecting ? "collection-selectable" : undefined}>
              {download.selecting && (
                <input type="checkbox" aria-label={`Select ${book.name} in ${book.bookTitle}`}
                  checked={download.selected.includes(book.id)} disabled={download.busy}
                  onChange={() => download.toggle(book.id)} />
              )}
              <Link href={book.href}>
                <span className="all-books-cover" aria-hidden="true">MB</span>
                <strong>{book.name}</strong>
                <span>{book.bookTitle}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="books-empty-state compact-empty-state">
          <h3>No memory books yet</h3>
          <p>Add a memory to start your collection.</p>
        </div>
      )}
      {!error && books.length > 0 && <CollectionDownloadActions state={download} />}
    </section>
  );
}