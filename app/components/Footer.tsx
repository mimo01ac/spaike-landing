import { DoubleRule, SpaikeWordmark } from "./EditorialUI";

export default function Footer() {
  return (
    <footer className="bg-cream-deep">
      <DoubleRule />
      <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-10 pb-7">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-12">
          <div>
            <SpaikeWordmark size="lg" />
            <p className="font-serif italic text-base text-ink-soft leading-snug mt-4 max-w-sm">
              Commercial impact, drevet af <span className="not-italic font-sans font-bold text-amber">AI</span>. Bygget af en der har stået i
              kommercielle roller i 15+ år.
            </p>
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted mt-4">
              Drevet af SpAIke ApS · Spiken er i kombinationen · AI + Commercial
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-3.5">
              Site
            </p>
            <ul className="font-serif text-base space-y-2">
              {/* Rod-relative: Footer genbruges på field note-sider. */}
              <li><a href="/#hvad-vi-bygger" className="hover:text-amber-dark transition-colors">Hvad vi bygger</a></li>
              <li><a href="/#manifest" className="hover:text-amber-dark transition-colors">Manifest</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-3.5">
              Kontakt
            </p>
            <ul className="font-serif text-base space-y-2">
              <li>
                <a
                  href="mailto:michael@spaike.dk"
                  data-track-event="email_click"
                  className="hover:text-amber-dark transition-colors"
                >
                  michael@spaike.dk
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/michaelmortensen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-umami-event="linkedin_click"
                  className="hover:text-amber-dark transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-9 pt-4 border-t border-rule flex justify-between font-mono text-[10px] tracking-widest uppercase text-muted">
          <span>© {new Date().getFullYear()} SpAIke ApS</span>
          <span>spaike.dk</span>
        </div>
      </div>
    </footer>
  );
}
