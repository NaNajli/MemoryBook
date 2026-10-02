
import { getBook } from "@/lib/getBooks";
import DownloadButton from "./downloadbutton";
// import App from "./pdfviewer";

export default async function BookPage() {
  const book = await getBook();
  const nameBook = book[0];

  return (
    
    <div className="text-center " >
      {/* <App book={book} /> */}
      <h1 className="text-6xl p-10 mt-4 md:mt-8;">{nameBook.topic}</h1>
    <div className="button button-small p-5 m-5" >
      <DownloadButton book={book} />
      </div>
    </div>

  );
}

export async function BooksList() {
  const book = await getBook();
  
  return (
    
    <div  >
      {book.map((item) => (
          <ul  key = {item.title}>
          <li>
          <h1 >{item.title}</h1>
          <p>{item.description}</p>
          </li>
        </ul>
      ))}
    </div>
    
  );
}
