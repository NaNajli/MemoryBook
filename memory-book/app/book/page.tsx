
import { getBook } from "@/lib/getBooks";
import DownloadButton from "./downloadbutton";

export default async function BookPage() {
  const book = await getBook(1);
  const nameBook = book[0]

  return (
    <div className="text-center " >
      <h1 className="text-6xl p-10 mt-4 md:mt-8;">{nameBook.title}</h1>
    <div className="button button-small p-5 m-5" >
      <DownloadButton book={book[0]} />
      </div>
    </div>

  );
}

export async function BooksList() {
  const book = await getBook(1);

  console.log("BOOK DATA:", book)
  
  return (
    <div  >
      {book.map((item) => (
          <ul key={`${item.id}-${item.image_id}`}>
            <li>
              <h1>{item.title}</h1>
              <p>{item.description}</p>
              <p>Image ID: {item.image_id}</p>
              <p>File Name: {item.file_name}</p>
            </li>
          </ul>
      ))}
    </div>
  );
}
