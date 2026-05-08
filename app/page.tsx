import Header from "./components/Header";
import Hero from "./components/Hero";
import Manifest from "./components/Manifest";
import DiscoveryCTA from "./components/DiscoveryCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifest />
        <DiscoveryCTA />
      </main>
      <Footer />
    </>
  );
}
