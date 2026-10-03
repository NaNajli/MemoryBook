import { Document, Image, Page, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 24, alignItems: "center", justifyContent: "center" },
  image: { width: 547, height: 793, objectFit: "contain" },
});

export function CollectionPdf({ images }: { images: { id: number; data: Buffer; format: "png" | "jpg" }[] }) {
  return (
    <Document title="Memory Book Images">
      {images.map((image) => (
        <Page key={image.id} size="A4" style={styles.page}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={{ data: image.data, format: image.format }} style={styles.image} />
        </Page>
      ))}
    </Document>
  );
}
