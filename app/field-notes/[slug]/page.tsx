import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { articles, slugs } from "../_articles";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const entry = articles[params.slug];
  return entry ? entry.metadata : { title: "Not found — SpAIke" };
}

export default function FieldNotePage({ params }: Params) {
  const entry = articles[params.slug];
  if (!entry) notFound();

  const ArticleBody = entry.component;
  return (
    <>
      <Header />
      <main>
        <ArticleBody />
      </main>
      <Footer />
    </>
  );
}
