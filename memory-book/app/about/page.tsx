import Footer from "../components/Footer";
import Navigation from "../components/navigation/Navigation";

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="simple-page page-shell">
        <p className="eyebrow">About Memory Book</p>
        <h1>Keep the stories behind the photographs.</h1>
        <p>Memory Book is a shared place for families and friends to gather photos, memories, and anecdotes into one meaningful collection.</p>
      </main>
      <Footer />
    </>
  );
}
