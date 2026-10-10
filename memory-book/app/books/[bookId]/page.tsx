import Link from "next/link";
import Navigation from "../../components/navigation/Navigation";
import { getBook } from "@/lib/getBooks";
import DownloadButton from "../../book/downloadbutton";

export default async function BookPage({
  params,
  searchParams,
 }: PageProps<"/books/[bookId]">) {
  const { bookId } = await params;
  const id = Number(bookId);
  const { topic } = await searchParams;

  if(!Number.isSafeInteger(id) || id <= 0 || Array.isArray(topic)) {
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
  const book = await getBook(id, topic);

  return (
    <>
      <Navigation variant="authenticated" />

      <main className="book-page-shell text-center">
        <p className="eyebrow">Memory Book</p>
         <span className="doodle-heart" aria-hidden="true">♡</span>
         <div className="mx-auto flex max-w-4xl items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 mb-10 mt-10">
         <span > ˖᯽˖</span>
          <p className="text-gray-500 dark:text-gray-400 p-10 text-2xl">Thank you for sharing your journey  with us. All your treasured contributions have been woven together into a timeless keepsake. Download your copy today and hold onto these memories forever.</p>
          <span > ˖᯽˖</span>
          </div>

        {/* <h1>
          {topic !== undefined ? (topic || "Uncategorized") : book.length > 0 ? book[0].book_title : "Empty Memory Book"}
        </h1> */}

        {book.length === 0 ? (
          <p>No memories in this book yet.</p>
        ) : (
          <div></div>
        //   <div>
        //     {book.map((item) => (
        //       <article key={`${item.id}-${item.image_id ?? "no-image"}`}>
        //         <h2>{item.title}</h2>

        //         {item.description && (
        //           <p>{item.description}</p>

        //         )}

        //         {item.image_id && item.image_data && (
        //           // Database images are embedded directly rather than optimized remote URLs.
        //           // eslint-disable-next-line @next/next/no-img-element
        //           <img
        //             src={`data:${item.mime_type};base64,${Buffer.from(
        //             item.image_data
        //           ).toString("base64")}`}
        //             alt={item.file_name || item.title}
        //           />
        //         )}
        //       </article>
        //     ))}
        // </div>
          
        )}
        <Link className="button button-secondary" href="/books">
          Back to Books
        </Link>
        {book.length > 0 && (
          <div className="button button-small p-5 m-5">
            <DownloadButton book={book} />  
          </div>
        )}
      </main>
    </>
  );
}