import Header from "./components/Header";
import Hero from "./components/Hero";
import WhatWeBuild from "./components/WhatWeBuild";
import Manifest from "./components/Manifest";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhatWeBuild />
        {/* Cases + DiscoveryCTA + Waitlist hidden for soft-launch — re-enable when ready */}
        <Manifest />
      </main>
      <Footer />
    </>
  );
}
