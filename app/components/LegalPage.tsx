import Link from "next/link";
import Logo from "./Logo";
import Footer from "./Footer";

type LegalPageProps = {
  title: string;
  updated?: string;
  children: React.ReactNode;
};

export default function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <header className="border-b border-rule">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
          <Link href="/" aria-label="SpAIke forside">
            <Logo size="sm" />
          </Link>
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-ink"
          >
            &larr; Forside
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="font-serif text-3xl font-semibold leading-tight md:text-4xl">
          {title}
        </h1>
        {updated ? (
          <p className="mt-3 font-mono text-xs uppercase tracking-wide text-muted">
            Senest opdateret {updated}
          </p>
        ) : null}
        <div className="legal-prose mt-10">{children}</div>
      </article>

      <Footer />
    </main>
  );
}
