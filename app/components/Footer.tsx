import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-background-secondary py-12">
      <div className="max-w-content mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start gap-10 md:justify-between">
          <div className="space-y-4 max-w-sm">
            <Logo size="sm" />
            <p className="text-sm text-neutral-600 leading-relaxed">
              AI-automation til danske mid-market virksomheder. Spiken er i
              kombinationen.
            </p>
            <p className="text-xs text-neutral-500">Drevet af mimoco ApS</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Kontakt</h3>
            <a
              href="mailto:michael@spaike.dk"
              className="block text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              michael@spaike.dk
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-200 text-xs text-neutral-500">
          © {new Date().getFullYear()} mimoco ApS
        </div>
      </div>
    </footer>
  );
}
