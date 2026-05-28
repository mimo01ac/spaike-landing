import type { Metadata } from "next";
import type { ComponentType } from "react";
import AnthropicSalesPlaybook, {
  metadata as anthropicSalesPlaybookMetadata,
} from "./anthropic-sales-playbook";

export interface FieldNoteEntry {
  component: ComponentType;
  metadata: Metadata;
}

export const articles: Record<string, FieldNoteEntry> = {
  "anthropic-sales-playbook": {
    component: AnthropicSalesPlaybook,
    metadata: anthropicSalesPlaybookMetadata,
  },
};

export const slugs = Object.keys(articles);
