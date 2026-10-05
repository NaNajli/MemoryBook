
import { getBook } from "@/lib/getBooks";
import DownloadButton from "./downloadbutton";
import { connection } from "next/server";
// import App from "./pdfviewer";

export default async function BookPage() {
  await connection();
  const book = await getBook(1);
  const nameBook = book[0]

  if (!nameBook) {
    return <main className="page-shell"><h1>No memories in this book yet.</h1></main>;
  }

  // Only send the serializable fields needed by the browser's PDF component.
  const pdfBook = book.map(({ id, title, description, topic, file_name, image_url }) => ({
    id, title, description, topic, file_name, image_url,
  }));

  return (
  
    <div className="text-center " >
      {/* <App book={book} /> */}
      <h1 className="text-6xl p-10 mt-4 md:mt-8;">{nameBook.topic}</h1>
    <div className="button button-small p-5 m-5" >
      <DownloadButton book={pdfBook} />
      </div>
    </div>
    

  );
}

export async function BooksList() {
  const book = await getBook(1);

  
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
