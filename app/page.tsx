import Header from "./components/Header";
import Hero from "./components/Hero";
import WhatWeBuild from "./components/WhatWeBuild";
import Manifest from "./components/Manifest";
import Waitlist from "./components/Waitlist";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhatWeBuild />
        {/* Cases + DiscoveryCTA hidden for soft-launch — re-enable when ready */}
        <Manifest />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
