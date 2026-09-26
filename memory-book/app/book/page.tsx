import DownloadButton from "./downloadbutton";
import { getBook } from "@/lib/getBooks";


export default async function BookPage() {
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

      <DownloadButton book={book[0]} />
    </div>
  );
}