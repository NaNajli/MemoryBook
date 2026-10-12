import { Page, Text, View, Document, StyleSheet,Tspan ,Svg , PDFViewer, Image  } from "@react-pdf/renderer";
import { Url } from "next/dist/shared/lib/router/router";
import React from 'react';


export type Book = {
  id: number; 
  title: string;
  description: string;
  topic:string
  file_name : string;
  image_id?: string; 
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
  coverPage: {
    backgroundColor: '#ccced2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
   coverFrame: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#8b7355",
    padding: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  coverSmall: {
    fontSize: 12,
    letterSpacing: 3,
    marginBottom: 30,
  },
coverTitle: {
    fontSize: 34,
    textAlign: "center",
    fontFamily: "Times-Roman",
  },

  coverSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 25,
    lineHeight: 1.6,
  },

  coverFooter: {
    position: "absolute",
    bottom: 40,
    fontSize: 11,
  },
 decorativeLine: {
    width: 80,
    borderBottomWidth: 1,
    borderBottomColor: "#8b7355",
    marginVertical: 15,
    alignSelf: "center",
  },
   pageFooter: {
    position: "absolute",
    bottom: 35,
    left: 0,
    right: 0,
    alignItems: "center",
    fontSize: 12,
  },



});


export function MyPdfDocument({ book }: { book: Book[]}) {
  return (

 <Document>
  <Page size="A4" style={styles.coverPage}>
  <View style={styles.coverFrame}>
          <Text style={styles.coverSmall}>OUR STORY</Text>

          <Text style={styles.coverTitle}>
            {book[0]?.topic || "Family Memories"}
          </Text>

          <View style={styles.decorativeLine} />

          <Text style={styles.coverSubtitle}>
            A book filled with memories, moments, and special people.
          </Text>

          <Text style={styles.coverFooter}>
           Memories to cherish forever
          </Text>
        </View>
      </Page>

  {book.map((item) => (
    <Page size="A4" style={styles.page} key={item.id}>
      <Text style={styles.heading}>
        {item.title}
      </Text>
      <Text style={styles.paragraph}>{item.description}</Text>
      <Image src={item.image_id || "/default-image.png"}
      style={{ width: 400, height: 400, marginTop: 20, alignSelf: 'center' }}
   />
      <View style={styles.borderFrame}></View> 
      <View style={styles.pageFooter}>
          </View>
    </Page>
  ))}
</Document>
   );
}