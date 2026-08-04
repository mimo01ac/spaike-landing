import type { Metadata } from "next";
import type { ComponentType } from "react";
import AnthropicSalesPlaybook, {
  metadata as anthropicSalesPlaybookMetadata,
} from "./anthropic-sales-playbook";
import VibeCodingGuide, {
  metadata as vibeCodingGuideMetadata,
} from "./vibe-coding-guide";
import AiPaaTegnestuen, {
  metadata as aiPaaTegnestuenMetadata,
} from "./ai-paa-tegnestuen";
import AiITransport, {
  metadata as aiITransportMetadata,
} from "./ai-i-transport";

export interface FieldNoteEntry {
  component: ComponentType;
  metadata: Metadata;
}

export const articles: Record<string, FieldNoteEntry> = {
  "anthropic-sales-playbook": {
    component: AnthropicSalesPlaybook,
    metadata: anthropicSalesPlaybookMetadata,
  },
  "vibe-coding-guide": {
    component: VibeCodingGuide,
    metadata: vibeCodingGuideMetadata,
  },
  "ai-paa-tegnestuen": {
    component: AiPaaTegnestuen,
    metadata: aiPaaTegnestuenMetadata,
  },
  "ai-i-transport": {
    component: AiITransport,
    metadata: aiITransportMetadata,
  },
};

export const slugs = Object.keys(articles);
