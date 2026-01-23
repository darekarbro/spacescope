'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CategoryList } from './CategoryCard';
import { ContentGrid } from './ContentCard';
import { DifficultyFilter, SearchBar } from './LearnFilters';
import { getLearnCategories, getLearnContents } from '@/lib/services/learnService';
import type { LearnCategory, LearnContent, DifficultyLevel } from '@/types/learn';

interface LearnSectionProps {
  initialCategories?: LearnCategory[];
  initialContents?: LearnContent[];
}

export function LearnSection({ initialCategories = [], initialContents = [] }: LearnSectionProps) {
  // State
  const [categories, setCategories] = useState<LearnCategory[]>(initialCategories);
  const [contents, setContents] = useState<LearnContent[]>(initialContents);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(initialCategories.length === 0);
  const [isLoadingContents, setIsLoadingContents] = useState(initialContents.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    if (initialCategories.length > 0) return;
    
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await getLearnCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, [initialCategories.length]);

  // Fetch contents when filters change
  const fetchContents = useCallback(async () => {
    try {
      setIsLoadingContents(true);
      setError(null);
      
      const response = await getLearnContents({
        category: selectedCategory || undefined,
        difficulty: difficulty || undefined,
        search: searchQuery || undefined,
      });
      
      setContents(response.data || []);
    } catch (err) {
      console.error('Failed to fetch contents:', err);
      setError('Failed to load content');
      setContents([]);
    } finally {
      setIsLoadingContents(false);
    }
  }, [selectedCategory, difficulty, searchQuery]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContents();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [fetchContents]);

  // Filter stats
  const stats = useMemo(() => {
    return {
      total: contents.length,
      beginner: contents.filter(c => c.difficulty === 'beginner').length,
      intermediate: contents.filter(c => c.difficulty === 'intermediate').length,
      advanced: contents.filter(c => c.difficulty === 'advanced').length,
    };
  }, [contents]);

  // Get current category name
  const currentCategoryName = useMemo(() => {
    if (!selectedCategory) return 'All Topics';
    const category = categories.find(c => c.id === selectedCategory);
    return category?.name || 'Topics';
  }, [selectedCategory, categories]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Universe</span>
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Discover fascinating topics about space, astronomy, and the cosmos. 
          From beginner-friendly guides to advanced scientific concepts.
        </p>
      </div>

      {/* Categories */}
      <section>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>📂</span> Categories
        </h3>
        <CategoryList
          categories={categories}
          selectedCategoryId={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isLoading={isLoadingCategories}
        />
      </section>

      {/* Filters & Search */}
      <section className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search topics, articles..."
          />
        </div>
        <DifficultyFilter
          selected={difficulty}
          onChange={setDifficulty}
        />
      </section>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {currentCategoryName}
          </h3>
          <p className="text-sm text-white/60">
            {stats.total} article{stats.total !== 1 ? 's' : ''} found
            {difficulty && ` • ${difficulty} level`}
            {searchQuery && ` • matching "${searchQuery}"`}
          </p>
        </div>
        
        {/* Stats badges */}
        <div className="hidden md:flex gap-2">
          <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">
            🌱 {stats.beginner} Beginner
          </span>
          <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-full border border-yellow-500/20">
            🌿 {stats.intermediate} Intermediate
          </span>
          <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20">
            🌳 {stats.advanced} Advanced
          </span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchContents}
            className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Content Grid */}
      <ContentGrid
        contents={contents}
        isLoading={isLoadingContents}
      />
    </div>
  );
}
