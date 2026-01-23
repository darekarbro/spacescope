'use client';

import React from 'react';
import type { LearnCategory } from '@/types/learn';

interface CategoryCardProps {
  category: LearnCategory;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryCard({ category, isSelected, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-4 rounded-xl border transition-all duration-300
        hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20
        ${isSelected 
          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20' 
          : 'bg-white/5 border-white/10 hover:border-cyan-400/30'
        }
      `}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center mb-3">
        {category.icon_url ? (
          <img 
            src={category.icon_url} 
            alt={category.name} 
            className="w-8 h-8 object-contain"
          />
        ) : (
          <span className="text-2xl">🌌</span>
        )}
      </div>
      
      {/* Name */}
      <h3 className={`font-semibold text-left transition-colors ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
        {category.name}
      </h3>
      
      {/* Description (truncated) */}
      <p className="text-sm text-white/60 text-left mt-1 line-clamp-2">
        {category.description}
      </p>
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      )}
    </button>
  );
}

interface CategoryListProps {
  categories: LearnCategory[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  isLoading?: boolean;
}

export function CategoryList({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory,
  isLoading 
}: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5 animate-pulse">
            <div className="w-12 h-12 rounded-lg bg-white/10 mb-3" />
            <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
            <div className="h-3 bg-white/10 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {/* All Categories Button */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`
          relative p-4 rounded-xl border transition-all duration-300
          hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20
          ${selectedCategoryId === null 
            ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20' 
            : 'bg-white/5 border-white/10 hover:border-purple-400/30'
          }
        `}
      >
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mb-3">
          <span className="text-2xl">🌟</span>
        </div>
        <h3 className={`font-semibold text-left transition-colors ${selectedCategoryId === null ? 'text-purple-400' : 'text-white'}`}>
          All Topics
        </h3>
        <p className="text-sm text-white/60 text-left mt-1">
          Browse everything
        </p>
        {selectedCategoryId === null && (
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        )}
      </button>
      
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          isSelected={selectedCategoryId === category.id}
          onClick={() => onSelectCategory(category.id)}
        />
      ))}
    </div>
  );
}
