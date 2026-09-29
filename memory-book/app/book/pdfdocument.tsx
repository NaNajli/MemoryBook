import { Page, Text, View, Document, StyleSheet  } from "@react-pdf/renderer";
import React from 'react';


export type Book = {
  title: string;
  description: string;
};

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
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
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


export function MyPdfDocument({ book }: { book: Book }) {
  return (
   
    <Document>
      <Page size="A4"  style={styles.page}>
        <View style={styles.header}></View>
        <Text >{book.title}</Text>
        <Text>{book.description}</Text>
        <view style={styles.borderFrame}></view>
      </Page>
    </Document>
  );
}

