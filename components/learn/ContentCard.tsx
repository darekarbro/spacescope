'use client';

import React from 'react';
import Link from 'next/link';
import type { LearnContent, LearnCategory } from '@/types/learn';
import { getDifficultyColor, getDifficultyIcon, formatDuration } from '@/lib/services/learnService';

interface ContentCardProps {
  content: LearnContent;
}

export function ContentCard({ content }: ContentCardProps) {
  const categoryName = typeof content.category === 'object' 
    ? (content.category as LearnCategory).name 
    : 'General';
  
  const difficultyClass = getDifficultyColor(content.difficulty);
  const difficultyEmoji = getDifficultyIcon(content.difficulty);
  
  // Get first image if available
  const coverImage = content.images && content.images.length > 0 
    ? content.images.sort((a, b) => a.order - b.order)[0].image_url 
    : null;

  return (
    <Link href={`/learn/${content.id}`}>
      <article className="group relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative h-40 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={content.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-30">🔭</span>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Category badge */}
          <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs text-white/80 border border-white/10">
            {categoryName}
          </div>
          
          {/* Duration */}
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
            <span>⏱️</span>
            {formatDuration(content.duration_minutes)}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Difficulty badge */}
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border mb-3 ${difficultyClass}`}>
            <span>{difficultyEmoji}</span>
            <span className="capitalize">{content.difficulty}</span>
          </div>
          
          {/* Title */}
          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
            {content.title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-white/60 line-clamp-2 mb-3">
            {content.description}
          </p>
          
          {/* Read more */}
          <div className="flex items-center text-sm text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Read more</span>
            <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5" />
        </div>
      </article>
    </Link>
  );
}

interface ContentGridProps {
  contents: LearnContent[];
  isLoading?: boolean;
}

export function ContentGrid({ contents, isLoading }: ContentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-pulse">
            <div className="h-40 bg-white/10" />
            <div className="p-4">
              <div className="h-4 bg-white/10 rounded w-20 mb-3" />
              <div className="h-5 bg-white/10 rounded w-full mb-2" />
              <div className="h-4 bg-white/10 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-white mb-2">No content found</h3>
        <p className="text-white/60">Try selecting a different category or adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {contents.map((content) => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  );
}
