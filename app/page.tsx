import Header from "./components/Header";
import Hero from "./components/Hero";
import WhatWeBuild from "./components/WhatWeBuild";
import DiscoveryCTA from "./components/DiscoveryCTA";
import BuildItYourself from "./components/BuildItYourself";
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
        <BuildItYourself />
        {/* Cases + Waitlist hidden for soft-launch — re-enable when ready */}
        <Manifest />
      </main>
      <Footer />
    </>
  );
}
