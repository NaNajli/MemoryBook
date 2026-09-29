import Link from "next/link";
import Navigation from "../../components/navigation/Navigation";

export default async function BookPage({ params }: PageProps<"/books/[bookId]">) {
  await params;

  return (
    <>
      <Navigation variant="authenticated" />
      <main className="book-placeholder page-shell">
        <p className="eyebrow">Memory Book</p>
        <h1>Book details coming soon</h1>
        <p>This page is ready for the selected book once database content is connected.</p>
        <Link className="button button-secondary" href="/dashboard">Back to Dashboard</Link>
      </main>
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 5b1b7efa70c1f406408acbce3878f787893b48b8
