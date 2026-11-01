/**
 * Tale-adapter (ElevenLabs) for /tilskud's voice-tilstand. Eneste sted der
 * kender leverandøren. Streamer mp3 fra ElevenLabs til klienten.
 *
 * Regler (vault: "Dansk voice-agent (ElevenLabs)" + "Voice-app mikrofon-tjek"):
 *  - ALDRIG engelsk stock-stemme til dansk: voice-id er en dansk stemme fra
 *    SpAIkes konto (env TILSKUD_TTS_VOICE), model eleven_flash_v2_5 (lav latens,
 *    understøtter dansk), language_code "da".
 *  - Tal skrives som ord i agentens svar hvor det er muligt; her stripper vi kun
 *    markdown og markører, så stemmen ikke læser "stjerne stjerne".
 */

const ELEVEN_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const MODEL = process.env.TILSKUD_TTS_MODEL || "eleven_flash_v2_5";
export const MAX_TTS_CHARS = 1500;

export function ttsKonfigureret(): boolean {
  return !!(process.env.ELEVENLABS_API_KEY && process.env.TILSKUD_TTS_VOICE);
}

/** Gør chat-markdown til noget der kan læses op. */
export function tilTale(markdown: string): string {
  return markdown
    .replace(/\n\n\[Kvalificering afgivet: [a-z]+\]$/i, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*•→]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/`+/g, "")
    .replace(/\[(.+?)\]\((.+?)\)/g, "$1")
    .replace(/https?:\/\/\S+/g, (u) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))
    .replace(/\s*\n\s*\n\s*/g, ". ")
    .replace(/\n/g, " ")
    .replace(/\.\s*\./g, ".")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, MAX_TTS_CHARS);
}

/** Returnerer en mp3-stream (eller null ved fejl/manglende config). */
export async function syntetiser(tekst: string): Promise<{ body: ReadableStream<Uint8Array>; contentType: string } | null> {
  const key = process.env.ELEVENLABS_API_KEY;
  const voice = process.env.TILSKUD_TTS_VOICE;
  if (!key || !voice) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(`${ELEVEN_URL}/${voice}/stream?output_format=mp3_44100_64`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({
        text: tekst,
        model_id: MODEL,
        language_code: "da",
        voice_settings: { stability: 0.5, similarity_boost: 0.75, speed: 1.0 },
      }),
      signal: ctrl.signal,
    });
    if (!res.ok || !res.body) {
      console.warn("TTS fejlede:", res.status, (await res.text()).slice(0, 160));
      return null;
    }
    return { body: res.body as ReadableStream<Uint8Array>, contentType: res.headers.get("content-type") || "audio/mpeg" };
  } catch (e) {
    console.warn("TTS exception:", (e as Error).message);
    return null;
  } finally {
    // Streamen holdes åben af klienten; timeren dækker kun forbindelsesfasen.
    clearTimeout(timer);
  }
}
