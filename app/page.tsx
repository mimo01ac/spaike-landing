import Header from "./components/Header";
import Hero from "./components/Hero";
import WhatWeBuild from "./components/WhatWeBuild";
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
        <BuildItYourself />
        {/* Cases + DiscoveryCTA + Waitlist hidden for soft-launch — re-enable when ready */}
        <Manifest />
      </main>
      <Footer />
    </>
  );
}
