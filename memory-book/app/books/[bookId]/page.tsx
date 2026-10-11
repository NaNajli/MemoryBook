import { notFound } from "next/navigation";
import { resolveCollectionUser } from "@/lib/shareLinks";
import Link from "next/link";
import Navigation from "../../components/navigation/Navigation";
import { getBook } from "@/lib/getBooks";

export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function BookPage({
  params,
  searchParams,
 }: PageProps<"/books/[bookId]">) {
  const { bookId } = await params;
  const id = Number(bookId);
  const { topic, share, userId: requestedUserId } = await searchParams;
  if (requestedUserId !== undefined || Array.isArray(share)) notFound();
  const userId = await resolveCollectionUser(share);
  if (userId === null) notFound();

  if(!Number.isSafeInteger(id) || id <= 0 || Array.isArray(topic) || Array.isArray(requestedUserId) || !Number.isSafeInteger(userId) || userId <= 0) {
    return (
      <>
        <Navigation variant="authenticated" />

        <main className="book-placeholder page-shell">
          <p className="eyebrow">Memory Book</p>

          <h1>Invalid Book ID</h1>

          <Link className="button button-secondary" href={share ? `/books?share=${share}` : "/books"}>
          Back to Books
          </Link>
        </main>
      </>
    );
  }

  const book = await getBook(id, topic, userId);

  return (
    <>
      <Navigation variant="authenticated" />

      <main className="book-page-shell">
        <p className="eyebrow">Memory Book</p>

        <h1>
          {topic !== undefined ? (topic || "Uncategorized") : book.length > 0 ? book[0].book_title : "Empty Memory Book"}
        </h1>

        {book.length === 0 ? (
          <p>No memories in this book yet.</p>
        ) : (
          <div>
            {book.map((item) => (
              <article key={`${item.id}-${item.image_id ?? "no-image"}`}>
                <h2>{item.title}</h2>

                {item.description && (
                  <p>{item.description}</p>
                )}

                {item.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={item.file_name || item.title} />
                )}
              </article>
            ))}
          </div>
        )}
        <Link className="button button-secondary" href={share ? `/books?share=${share}` : "/books"}>
          Back to Books
        </Link>
      </main>
    </>
  );
}
