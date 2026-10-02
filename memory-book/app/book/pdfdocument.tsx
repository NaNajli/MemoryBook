import { Page, Text, View, Document, StyleSheet,Tspan ,Svg , PDFViewer  } from "@react-pdf/renderer";
import { Url } from "next/dist/shared/lib/router/router";
import React from 'react';


export type Book = {
  id: number; 
  title: string;
  description: string;
  topic:string
  file_name : string;
  image_url?: string; 
};

const heading = { fontSize: 16 };

const styles = StyleSheet.create({

  page: {
    padding: 48,
    fontSize: 11,
    lineHeight: 1.6,
    color: '#3f3f46',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#e4e4e7',
    paddingBottom: 12,
  },
  title: {
    fontSize: 46,
    fontFamily: "Cantarell", 
    borderBottomWidth: 3,
    color: '#e0301e',
    marginTop: 40,
    paddingBottom: 16,
    borderBottomColor: '#e0301e',
    
  },
  paragraph: {
    marginTop: 20,
  },
  
  borderFrame: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
    bottom: 24,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderStyle: 'solid',
  },
});


export function MyPdfDocument({ book }: { book: Book[]}) {
  return (

 <Document>
  {book.map((item) => (
    <Page size="A4" style={styles.page} key={item.id}>
      <Svg viewBox="0 0 120 60" width={240} height={120}>
    <Text x="24" y="36" fill="#3e3e3e" style={heading}>
      {item.topic} <Tspan fill="#e82200">{item.title}</Tspan>
    </Text>
  </Svg>
      <Text>{item.title}</Text>
      <Text>{item.topic}</Text>
      <Text>{item.description}</Text>
      <Text>{item.file_name}</Text>
      <view style={styles.borderFrame}></view> 
    </Page>
  ))}
</Document>
   );
}



