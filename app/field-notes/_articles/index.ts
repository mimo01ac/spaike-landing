import type { Metadata } from "next";
import type { ComponentType } from "react";
import AnthropicSalesPlaybook, {
  metadata as anthropicSalesPlaybookMetadata,
} from "./anthropic-sales-playbook";
import VibeCodingGuide, {
  metadata as vibeCodingGuideMetadata,
} from "./vibe-coding-guide";

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
};

export const slugs = Object.keys(articles);
