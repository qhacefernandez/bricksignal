'use client';

import type { LegalDocument } from '@/i18n/legal';

interface Props {
  document: LegalDocument;
}

export default function LegalDocumentPage({ document }: Props) {
  return (
    <article className="max-w-2xl space-y-8 text-slate-700">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">{document.title}</h1>
        {document.subtitle && <p className="text-slate-600">{document.subtitle}</p>}
        <p className="text-xs text-slate-400">{document.lastUpdated}</p>
      </header>

      {document.sections.map((section) => (
        <section key={section.id} className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="text-sm leading-relaxed">
              {paragraph}
            </p>
          ))}
          {section.listItems && (
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {section.listItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}
