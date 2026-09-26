import {
  Document,
  Page,
  Text,
  Image,
} from "@react-pdf/renderer";

export type Book = {
  title: string;
  description: string;
};

export function MyPdfDocument({ book }: { book: Book }) {
  return (
    <Document>
      <Page size="A4">
        <Text >{book.title}</Text>
        <Text>{book.description}</Text>
      </Page>
    </Document>
  );
}