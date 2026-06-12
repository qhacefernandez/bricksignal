/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'jspdf-autotable' {
  import type { jsPDF } from 'jspdf';
  import type { UserOptions } from 'jspdf-autotable';

  export type { UserOptions };
  export default function autoTable(doc: jsPDF, options: UserOptions): void;
}
