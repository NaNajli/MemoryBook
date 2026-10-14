import { getCurrentUserId } from "@/lib/currentUser";
import { notFound } from "next/navigation";
import { resolveCollectionUser } from "@/lib/shareLinks";
import Link from "next/link";
import Navigation from "../../components/navigation/Navigation";
import { getBook } from "@/lib/getBooks";
import DownloadButton from "../../book/downloadbutton";
import ViewBook from "./ViewBook";

export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function BookPage({
  params,
  searchParams,
 }: PageProps<"/books/[bookId]">) {
  const { bookId } = await params;
  const id = Number(bookId);
  const { topic, share, userId: requestedUserId } = await searchParams;
  if (share === undefined) await getCurrentUserId();
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
  const pdfBook = book.map(({ id, title, description, topic, file_name, image_url }) => ({
    id, title, description, topic, file_name, image_url,
  }));

  return (
    <>
      <Navigation variant="authenticated" />

      <main className="book-page-shell text-center">
        <p className="eyebrow">Memory Book</p>
        <span className="doodle-heart" aria-hidden="true">♡</span>
        <div className="mx-auto flex max-w-4xl items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 mb-10 mt-10">
          <span aria-hidden="true">˖᯽˖</span>
          <p className="text-gray-500 dark:text-gray-400 p-10 text-2xl">
            Thank you for sharing your journey with us. All your treasured contributions have been woven together into a timeless keepsake. Download your copy today and hold onto these memories forever.
          </p>
          <span aria-hidden="true">˖᯽˖</span>
        </div>

        <h1>
          {topic !== undefined ? (topic || "Uncategorized") : book.length > 0 ? book[0].book_title : "Empty Memory Book"}
        </h1>

        {book.length === 0 ? (
          <p>No memories in this book yet.</p>
        ) : (
          <div className="button button-small p-5 m-5">
           <ViewBook memories={book.map((item) => ({
             id: item.id,
             image_id: item.image_id,
             title: item.title,
             description: item.description,
             file_name: item.file_name,
             imageSrc: item.image_url,
}))} />
          </div>
        )}
        <Link className="button button-secondary" href={share ? `/books?share=${share}` : "/books"}>
          Back to Books
        </Link>
        {book.length > 0 && (
          <div className="button button-small p-5 m-5">
            <DownloadButton book={pdfBook} />
          </div>
        )}
      </main>
    </>
  );
}