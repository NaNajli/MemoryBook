import Link from "next/link";
import Navigation from "../../components/navigation/Navigation";
import { getBook } from "@/lib/getBooks";

export default async function BookPage({ 
  params,
 }: PageProps<"/books/[bookId]">) {
  const { bookId } = await params;
  const id = Number(bookId);

  if(!Number.isInteger(id)) {
    return (
      <>
        <Navigation variant="authenticated" />

        <main className="book-placeholder page-shell">
          <p className="eyebrow">Memory Book</p>

          <h1>Invalid Book ID</h1>

          <Link className="button button-secondary" href="/books">
          Back to Books
          </Link>
        </main>
      </>
    );
  }

  const book = await getBook(id);

  return (
    <>
      <Navigation variant="authenticated" />

      <main className="book-page-shell">
        <p className="eyebrow">Memory Book</p>

        <h1>
          {book.length > 0 ? book[0].title : "Empty Memory Book"}
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

                {item.image_id && item.image_data && (
                  <img
                    src={`data:${item.mime_type};base64,${Buffer.from(
                    item.image_data
                  ).toString("base64")}`}
                    alt={item.file_name}
                  />
                )}
              </article>
            ))}
          </div>
        )}
        <Link className="button button-secondary" href="/books">
          Back to Books
        </Link>
      </main>
    </>
  );
}
       
