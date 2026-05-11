import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-background-secondary py-12 md:py-16">
      <div className="max-w-content mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          <div className="space-y-4 max-w-sm">
            <Logo size="sm" />
            <p className="text-sm text-neutral-700 leading-relaxed">
              AI der flytter forretningstal — bygget af en der har stået i
              kommercielle roller i 15+ år.
            </p>
            <p className="text-xs text-neutral-500">
              Drevet af mimoco ApS · Spiken er i kombinationen.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
              Site
            </h3>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li>
                <a href="#hvad-vi-bygger" className="hover:text-neutral-900 transition-colors">
                  Hvad vi bygger
                </a>
              </li>
              <li>
                <a href="#cases" className="hover:text-neutral-900 transition-colors">
                  Cases
                </a>
              </li>
              <li>
                <a href="#discovery" className="hover:text-neutral-900 transition-colors">
                  Discovery
                </a>
              </li>
              <li>
                <a href="#manifest" className="hover:text-neutral-900 transition-colors">
                  Manifest
                </a>
              </li>
              <li>
                <a href="#om" className="hover:text-neutral-900 transition-colors">
                  Om Michael
                </a>
              </li>
              <li>
                <a href="#waitlist" className="hover:text-neutral-900 transition-colors">
                  Waitlist
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wide text-neutral-900">
              Kontakt
            </h3>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li>
                <a
                  href="mailto:michael@spaike.dk"
                  className="hover:text-neutral-900 transition-colors"
                >
                  michael@spaike.dk
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/michaelsbm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-900 transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://assessment.spaike.dk"
                  className="hover:text-neutral-900 transition-colors"
                >
                  SpAIke Discovery →
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-200 text-xs text-neutral-500 flex flex-col md:flex-row md:justify-between gap-2">
          <span>© {new Date().getFullYear()} mimoco ApS</span>
          <span>spaike.dk</span>
        </div>
      </div>
    </footer>
  );
}
