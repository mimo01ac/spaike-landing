import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background-primary/90 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-content mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#top" aria-label="SpAIke">
          <Logo size="md" />
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
          <a href="#hvad-vi-bygger" className="hover:text-neutral-900 transition-colors">
            Hvad vi bygger
          </a>
          <a href="#cases" className="hover:text-neutral-900 transition-colors">
            Cases
          </a>
          <a href="#discovery" className="hover:text-neutral-900 transition-colors">
            Discovery
          </a>
          <a href="#om" className="hover:text-neutral-900 transition-colors">
            Om
          </a>
          <a href="#waitlist" className="hover:text-neutral-900 transition-colors">
            Waitlist
          </a>
        </nav>
        <a
          href="#waitlist"
          className="bg-spaike-blue hover:bg-spaike-blue-dark text-black font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          Kom på waitlist
        </a>
      </div>
    </header>
  );
}
