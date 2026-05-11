import Header from "./components/Header";
import Hero from "./components/Hero";
import WhatWeBuild from "./components/WhatWeBuild";
import Cases from "./components/Cases";
import DiscoveryCTA from "./components/DiscoveryCTA";
import Manifest from "./components/Manifest";
import About from "./components/About";
import Waitlist from "./components/Waitlist";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhatWeBuild />
        <Cases />
        <DiscoveryCTA />
        <Manifest />
        <About />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
