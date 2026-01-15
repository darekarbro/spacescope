'use client';

import React from 'react';

export default function TopicPage({
  params,
}: {
  params: { topic: string };
}) {
  return (
    <div className="min-h-screen">
      <h1>Topic: {params.topic}</h1>
    </div>
  );
}
