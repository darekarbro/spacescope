import React from 'react';

interface Props {
  text?: string;
}

// Minimal markdown-ish renderer: splits paragraphs and preserves line breaks.
export default function SimpleMarkdown({ text }: Props) {
  if (!text) return null;

  const paragraphs = text.split(/\n\n+/).map((p) => p.trim());

  return (
    <div>
      {paragraphs.map((p, idx) => (
        <p key={idx} className="mb-4 text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  );
}
