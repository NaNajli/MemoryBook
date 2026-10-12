"use client";
import { PDFViewer, Document, Page, Text ,View, StyleSheet } from '@react-pdf/renderer';


const heading = { fontSize: 16,
 
 };

export default function App({ book}: { book: any[] }) {
  return (
    <PDFViewer style={{ width: "100%", height: "90vh" }}>
      <Document>
        {book.map((item) => (
          <Page size="A4" key={item.title}>

            <View>
             ```tsx
<div className="space-y-8 px-12 py-12 text-[11px] leading-[1.6] text-zinc-700">
  {book.map((item) => (
    <article
      key={`${item.id}-${item.image_id ?? "no-image"}`}
      className="relative rounded-lg border border-zinc-200 bg-white p-8"
    >
      <h2 className="m-5 text-center font-serif text-4xl text-[#433f3e]">
        {item.title}
      </h2>

      {item.description && (
        <p className="mt-5 text-center text-xs leading-[1.7]">
          {item.description}
        </p>
      )}

      {item.image_id && item.image_data && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:${item.mime_type};base64,${Buffer.from(
            item.image_data
          ).toString("base64")}`}
          alt={item.file_name || item.title}
          className="mx-auto mt-5 h-[400px] w-full max-w-[400px] object-contain"
        />
      )}

      <div className="pointer-events-none absolute inset-3 rounded-lg border border-zinc-200" />

      <div className="mt-6 text-center text-xs text-[#8b7355]">
        ♥
      </div>
    </article>
  ))}
</div>
```
            </View>

          </Page>
        ))}
      </Document>

      
    </PDFViewer>
  );
}