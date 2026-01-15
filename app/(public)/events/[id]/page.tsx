'use client';

import React from 'react';

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen">
      <h1>Event Detail: {params.id}</h1>
    </div>
  );
}
