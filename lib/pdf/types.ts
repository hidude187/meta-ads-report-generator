// lib/pdf/types.ts
// Shared context object passed to every page-drawing function.

import type { jsPDF } from "jspdf";

export type Doc = jsPDF;

export type PdfCtx = {
  doc: Doc;
  W: number;
  H: number;
  // brand RGB channels
  br: number; bg: number; bb: number;
  // dark variant RGB channels
  dr: number; dg: number; db: number;
  cur: string;
  hasAmiri: boolean;
  LF: (s?: "bold" | "normal") => void;
  AF: () => void;
  pageFooter: (pageNum: number) => void;
};
