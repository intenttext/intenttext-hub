import type { IntentDocument } from "@intenttext/core";

export interface HubTemplate {
  _id?: string;
  slug: string;
  name: string;
  description: string;
  category: "agent" | "workflow" | "document";
  tags: string[];
  author: string;
  source: string;
  document: IntentDocument;
  status: "pending" | "approved" | "rejected";
  autoApproved: boolean;
  downloads: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  trust?: {
    tracked: boolean;
    frozen: boolean;
    frozenAt?: string;
    signers?: string[];
  };
}
