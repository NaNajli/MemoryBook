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
              <Text style={heading}>{item.title}</Text>
              <Text>{item.topic}</Text>
              <Text>{item.description}</Text>
              <Text>{item.file_name}</Text>
            </View>

          </Page>
        ))}
      </Document>
    </PDFViewer>
  );
}