"use client";

/**
 * "Download som PDF" (SPA-1291): åbner browserens print-dialog, hvor
 * print-stilarket i globals.css (.katalog) lægger kataloget på 2 A4-sider.
 * Umami-eventet sendes af Analytics.tsx (delegeret klik via data-track-event),
 * før dialogen åbner. Titlen sættes kort, så den gemte fil hedder noget pænt.
 */
export default function PdfKnap({
  placering,
  inverted = false,
}: {
  placering: string;
  inverted?: boolean;
}) {
  function print() {
    const titel = document.title;
    document.title = "SpAIke ydelser og priser";
    window.print();
    document.title = titel;
  }

  return (
    <button
      type="button"
      onClick={print}
      data-track-event="ydelser_pdf_click"
      data-track-placering={placering}
      className={`print-skjul inline-flex items-center gap-2 px-5 py-3 font-sans font-medium text-[15px] underline underline-offset-4 transition-colors ${
        inverted
          ? "text-cream decoration-cream/40 hover:text-amber hover:decoration-amber"
          : "text-ink decoration-rule hover:text-amber-dark hover:decoration-amber-dark"
      }`}
    >
      Download som PDF
    </button>
  );
}
