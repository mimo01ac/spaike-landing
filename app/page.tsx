import Header from "./components/Header";
import Hero from "./components/Hero";
import WhatWeBuild from "./components/WhatWeBuild";
import DiscoveryCTA from "./components/DiscoveryCTA";
import Manifest from "./components/Manifest";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhatWeBuild />
        <DiscoveryCTA />
        <Manifest />
      </main>
      <Footer />
    </>
  );
}
