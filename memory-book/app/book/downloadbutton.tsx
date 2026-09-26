"use client";

import { useEffect, useState } from "react";
import type { Book } from "./pdfdocument";

export default function DownloadButton({ book }: { book: Book }) {
  const [PDFDownloadLink, setPDFDownloadLink] = useState<any>(null);
  const [MyPdfDocument, setMyPdfDocument] = useState<any>(null);

  useEffect(() => {
    async function loadPDF() {
      const pdf = await import("@react-pdf/renderer");
      const document = await import("./pdfdocument");

      setPDFDownloadLink(() => pdf.PDFDownloadLink);
      setMyPdfDocument(() => document.MyPdfDocument);
    }

    loadPDF();
  }, []);

  if (!PDFDownloadLink || !MyPdfDocument) {
    return <p>Loading PDF...</p>;
  }

  return (
    <PDFDownloadLink
      document={<MyPdfDocument book={book} />}
      fileName={book.title}
    >
      {({ loading }: { loading: boolean }) =>
        loading ? "Generating PDF..." : "Download PDF"
      }
    </PDFDownloadLink>
  );
}