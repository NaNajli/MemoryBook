import { Page, Text, View, Document, StyleSheet,Tspan ,Svg , PDFViewer, Image  } from "@react-pdf/renderer";
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


const styles = StyleSheet.create({

  page: {
    padding: 48,
    fontSize: 11,
    lineHeight: 1.6,
    color: '#3f3f46',
  },

  heading: {
  fontSize: 36,
  color: '#433f3e',
  FontFamily: "Times-BoldItalic",
  textAlign: 'center',
  margin: 20,
  textTransform:'upperfirst',
  
  }
,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#e4e4e7',
    paddingBottom: 12,
   
  },

  paragraph: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 1.7,
   
  },
  
  borderFrame: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },

});


export function MyPdfDocument({ book }: { book: Book[]}) {
  return (

 <Document>
  {book.map((item) => (
    <Page size="A4" style={styles.page} key={item.id}>
      <Text style={styles.heading}>
        {item.title}
      </Text>
      <Text style={styles.paragraph}>{item.description}</Text>
      <Image src={item.image_url || "/default-image.png"}
      style={{ width: 400, height: 400, marginTop: 20, alignSelf: 'center' }}
   />
      <View style={styles.borderFrame}></View> 
    </Page>
  ))}
</Document>
   );
}



