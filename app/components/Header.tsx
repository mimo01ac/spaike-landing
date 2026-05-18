import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-rule">
      <div className="max-w-editorial mx-auto px-6 md:px-14 py-5 flex items-center justify-between gap-6">
        <a href="#top" aria-label="SpAIke" className="flex items-baseline gap-3.5">
          <Logo size="md" />
          <span className="hidden md:inline font-mono text-[10px] tracking-widest uppercase text-muted">
            AI advisory
          </span>
        </a>
        <nav className="hidden lg:flex items-center gap-8 font-sans text-[13px] text-ink">
          <a href="#hvad-vi-bygger" className="hover:text-amber-dark transition-colors">
            Hvad vi bygger
          </a>
          <a href="#manifest" className="hover:text-amber-dark transition-colors">
            Manifest
          </a>
        </nav>
        <a
          href="https://calendly.com/michael-spaike/new-meeting"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-ink text-cream px-4 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors"
        >
          Book møde →
        </a>
      </div>
    </header>
  );
}
