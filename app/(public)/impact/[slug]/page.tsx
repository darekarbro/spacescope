'use client';

import React from 'react';

export default function ImpactDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="min-h-screen">
      <h1>Impact Case Study: {params.slug}</h1>
    </div>
  );
}
