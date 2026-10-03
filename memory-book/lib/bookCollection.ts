import pool from "@/lib/db";

export type MemoryBookSummary = {
  id: string;
  name: string;
  bookTitle: string;
  href: string;
};

type CollectionRow = {
  book_id: number;
  book_title: string;
  topic: string | null;
  memory_count: string;
};

export async function getBookCollection(userId: number): Promise<MemoryBookSummary[]> {
  const result = await pool.query<CollectionRow>(
    `SELECT b.id AS book_id, b.title AS book_title,
            NULLIF(BTRIM(m.topic), '') AS topic, COUNT(m.id) AS memory_count
       FROM memory_books b
       LEFT JOIN memories m ON m.memory_book_id = b.id
      WHERE b.user_id = $1
      GROUP BY b.id, b.title, NULLIF(BTRIM(m.topic), '')
      ORDER BY b.title, b.id, topic NULLS LAST`,
    [userId],
  );

  return result.rows.map((row) => {
    const emptyBook = Number(row.memory_count) === 0;
    const query = emptyBook ? "" : `?${new URLSearchParams({ topic: row.topic ?? "" })}`;

    return {
      id: JSON.stringify([row.book_id, row.topic]),
      name: row.topic ?? (emptyBook ? row.book_title : "Uncategorized"),
      bookTitle: row.book_title,
      href: `/books/${row.book_id}${query}`,
    };
  });
}

export async function loadBookCollection(userId: number) {
  try {
    return { books: await getBookCollection(userId), error: false };
  } catch (error) {
    console.error("Unable to load the book collection:", error);
    return { books: [], error: true };
  }
}
