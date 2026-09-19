import Footer from "./components/Footer";
import Hero from "./components/home/Hero";
import HowItWorks from "./components/home/HowItWorks";
import MemoryTogether from "./components/home/MemoryTogether";
import Navigation from "./components/navigation/Navigation";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <HowItWorks />
        <MemoryTogether />
      </main>
      <Footer />
    </>
  );
}
