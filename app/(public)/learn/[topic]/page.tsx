'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getLearnContent } from '@/lib/services/learnService';
import { getDifficultyColor, getDifficultyIcon, formatDuration } from '@/lib/services/learnService';
import type { LearnContent, LearnCategory } from '@/types/learn';

export default function LearnContentPage() {
  const params = useParams();
  const id = params.topic as string;
  
  const [content, setContent] = useState<LearnContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getLearnContent(Number(id));
        setContent(data);
      } catch (err) {
        console.error('Failed to fetch content:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchContent();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-1/4" />
          <div className="h-12 bg-white/10 rounded w-3/4" />
          <div className="h-64 bg-white/10 rounded" />
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-5/6" />
            <div className="h-4 bg-white/10 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-4">Content Not Found</h2>
          <p className="text-white/60 mb-6">{error || 'The content you\'re looking for doesn\'t exist.'}</p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Learning
          </Link>
        </div>
      </div>
    );
  }

  const categoryName = typeof content.category === 'object'
    ? (content.category as LearnCategory).name
    : 'General';
  
  const sortedImages = content.images?.sort((a, b) => a.order - b.order) || [];
  const difficultyClass = getDifficultyColor(content.difficulty);
  const difficultyEmoji = getDifficultyIcon(content.difficulty);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-white/60">
          <li>
            <Link href="/learn" className="hover:text-cyan-400 transition-colors">
              Learning
            </Link>
          </li>
          <li>/</li>
          <li className="text-cyan-400">{categoryName}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Category */}
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full border border-cyan-500/30">
            {categoryName}
          </span>
          
          {/* Difficulty */}
          <span className={`px-3 py-1 text-sm rounded-full border ${difficultyClass} flex items-center gap-1`}>
            <span>{difficultyEmoji}</span>
            <span className="capitalize">{content.difficulty}</span>
          </span>
          
          {/* Duration */}
          <span className="px-3 py-1 bg-white/10 text-white/70 text-sm rounded-full border border-white/20 flex items-center gap-1">
            <span>⏱️</span>
            {formatDuration(content.duration_minutes)}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {content.title}
        </h1>
        
        <p className="text-lg text-white/70">
          {content.description}
        </p>
      </header>

      {/* Featured Image Gallery */}
      {sortedImages.length > 0 && (
        <div className="mb-10">
          {/* Main Image */}
          <div className="relative aspect-video bg-black/50 rounded-xl overflow-hidden mb-4 border border-white/10">
            <img
              src={sortedImages[selectedImageIndex].image_url}
              alt={sortedImages[selectedImageIndex].caption || content.title}
              className="w-full h-full object-contain"
            />
            {sortedImages[selectedImageIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-sm text-white/80">{sortedImages[selectedImageIndex].caption}</p>
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {sortedImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sortedImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex
                      ? 'border-cyan-400 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={image.caption || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Body */}
      <article className="prose prose-invert prose-cyan max-w-none">
        <div 
          className="text-white/80 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: (content.content || '').replace(/\n/g, '<br />') }}
        />
      </article>

      {/* Footer Navigation */}
      <footer className="mt-12 pt-8 border-t border-white/10">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link
            href="/learn"
            className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Learning Hub
          </Link>
          
          {/* Share buttons placeholder */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/40">Share:</span>
            <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-cyan-500/20 text-white/60 hover:text-cyan-400 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </button>
            <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-cyan-500/20 text-white/60 hover:text-cyan-400 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
