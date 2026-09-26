"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { MyPdfDocument } from "./pdfdocument";
import { Book } from "@/app/book/pdfdocument"


export default function DownloadButton({ book }: { book: Book }) {
  return (
    <>
    <div>
      <PDFDownloadLink
        document={<MyPdfDocument book={book} />}
        fileName = {book.title}
      >
        {({ loading }) =>
          loading ? "Generating PDF..." :  "Download PDF"
         }
      </PDFDownloadLink>
      </div>
    
    </>
  );
}