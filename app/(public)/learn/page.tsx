'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getLearnCategories, getLearnContents, formatDuration } from '@/lib/services/learnService';
import type { LearnCategory, LearnContent, DifficultyLevel } from '@/types/learn';
import SolarSystemExplorer from '@/components/solar-system/SolarSystemExplorer';

// ============= ANIMATED BACKGROUND STARS =============
function StarField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Static stars */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(1px 1px at 20px 30px, white, transparent),
                     radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
                     radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.6), transparent),
                     radial-gradient(1px 1px at 90px 40px, white, transparent),
                     radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent),
                     radial-gradient(1.5px 1.5px at 160px 120px, rgba(100,200,255,0.9), transparent),
                     radial-gradient(1px 1px at 200px 200px, white, transparent),
                     radial-gradient(1px 1px at 250px 20px, rgba(255,255,255,0.5), transparent),
                     radial-gradient(1px 1px at 300px 100px, white, transparent),
                     radial-gradient(2px 2px at 400px 50px, rgba(100,200,255,0.8), transparent)`,
        backgroundSize: '500px 500px',
      }} />
      
      {/* Twinkling stars */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            opacity: 0.3 + Math.random() * 0.7,
          }}
        />
      ))}
      
      {/* Nebula gradients */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-500/20 rounded-full blur-[80px]" />
      </div>
    </div>
  );
}

// ============= HERO SECTION =============
function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Central planet/galaxy effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[600px] h-[600px]">
          {/* Orbital rings */}
          <div className="absolute inset-0 border border-cyan-500/10 rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-8 border border-purple-500/10 rounded-full animate-[spin_45s_linear_infinite_reverse]" />
          <div className="absolute inset-16 border border-blue-500/10 rounded-full animate-[spin_30s_linear_infinite]" />
          
          {/* Central glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-400 text-sm font-medium">Learning Hub</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-white">Explore the</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
            Cosmos
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
          Embark on a journey through space and time. From black holes to distant galaxies, 
          discover the wonders of our universe through interactive content and stunning visuals.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="#explore" className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105 flex items-center gap-2">
            Start Exploring
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a href="#solar-system" className="px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-cyan-500/30 flex items-center gap-2">
            <span>🪐</span>
            View Solar System
          </a>
        </div>
        
        {/* Stats */}
        <div className="flex justify-center gap-12 mt-12 pt-8 border-t border-white/10">
          <div className="text-center">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">∞</div>
            <div className="text-sm text-white/60 mt-1">Galaxies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">8</div>
            <div className="text-sm text-white/60 mt-1">Planets</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">1</div>
            <div className="text-sm text-white/60 mt-1">Star (Our Sun)</div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

// ============= CATEGORY CARD (ENHANCED) =============
interface CategoryCardProps {
  category: LearnCategory;
  isSelected: boolean;
  onClick: () => void;
}

function CategoryCard({ category, isSelected, onClick }: CategoryCardProps) {
  const icons = ['🌌', '🚀', '🪐', '⭐', '🌙', '☄️', '🔭', '🌍'];
  const randomIcon = icons[category.id % icons.length];
  
  return (
    <button
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-500 
        border backdrop-blur-sm min-w-[200px] flex-shrink-0
        ${isSelected 
          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-500/50 shadow-xl shadow-cyan-500/20 scale-105' 
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-400/30'
        }
      `}
    >
      {/* Animated background orb */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl transition-opacity duration-500 ${isSelected ? 'opacity-60' : 'opacity-0 group-hover:opacity-30'}`}
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.5), transparent)' }}
      />
      
      {/* Icon container */}
      <div className={`
        w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300
        ${isSelected 
          ? 'bg-gradient-to-br from-cyan-500/40 to-blue-500/40 shadow-lg shadow-cyan-500/20' 
          : 'bg-white/10'
        }
      `}>
        {category.icon_url ? (
          <img src={category.icon_url} alt="" className="w-8 h-8 object-contain" />
        ) : (
          <span className="text-2xl">{randomIcon}</span>
        )}
      </div>
      
      {/* Name */}
      <h3 className={`font-bold text-lg mb-2 transition-colors ${isSelected ? 'text-cyan-400' : 'text-white group-hover:text-cyan-300'}`}>
        {category.name}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
        {category.description}
      </p>
      
      {/* Content count badge */}
      {category.content_count !== undefined && category.content_count > 0 && (
        <div className="absolute top-4 right-4 px-2 py-1 bg-white/10 rounded-full text-xs text-white/70">
          {category.content_count} articles
        </div>
      )}
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
      )}
    </button>
  );
}

// ============= CONTENT CARD (ENHANCED) =============
interface ContentCardNewProps {
  content: LearnContent;
  index: number;
}

function ContentCardNew({ content, index }: ContentCardNewProps) {
  const categoryName = typeof content.category === 'object' 
    ? (content.category as LearnCategory).name 
    : 'General';
  
  const difficultyConfig = {
    beginner: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', icon: '🌱' },
    intermediate: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '🌿' },
    advanced: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', icon: '🌳' },
  };
  
  const config = difficultyConfig[content.difficulty] || difficultyConfig.beginner;
  
  const coverImage = content.images && content.images.length > 0 
    ? content.images.sort((a, b) => a.order - b.order)[0].image_url 
    : null;

  return (
    <Link href={`/learn/${content.id}`}>
      <article 
        className="group relative h-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Cover Image / Placeholder */}
        <div className="relative h-48 overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={content.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl" />
                <span className="relative text-6xl">🔭</span>
              </div>
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
          
          {/* Category badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-xs font-medium text-white border border-white/10">
            {categoryName}
          </div>
          
          {/* Duration badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 backdrop-blur-md rounded-lg text-xs font-medium text-cyan-300 border border-cyan-500/30">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDuration(content.duration_minutes)}
          </div>
          
          {/* Bottom title preview */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} mb-2`}>
              <span>{config.icon}</span>
              <span className="capitalize">{content.difficulty}</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300 leading-tight">
            {content.title}
          </h3>
          
          <p className="text-sm text-white/50 line-clamp-3 mb-4 leading-relaxed">
            {content.description}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center text-sm text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
              <span>Start Learning</span>
              <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            
            {/* Image count */}
            {content.images && content.images.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-white/40">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {content.images.length}
              </div>
            )}
          </div>
        </div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
        </div>
      </article>
    </Link>
  );
}

// ============= LOADING SKELETON =============
function ContentSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-white/10" />
      <div className="p-5">
        <div className="h-3 bg-white/10 rounded-full w-20 mb-4" />
        <div className="h-5 bg-white/10 rounded w-full mb-2" />
        <div className="h-5 bg-white/10 rounded w-3/4 mb-4" />
        <div className="h-4 bg-white/10 rounded w-full mb-2" />
        <div className="h-4 bg-white/10 rounded w-5/6" />
      </div>
    </div>
  );
}

// ============= MAIN LEARN PAGE =============
export default function LearnPage() {
  const [categories, setCategories] = useState<LearnCategory[]>([]);
  const [contents, setContents] = useState<LearnContent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingContents, setIsLoadingContents] = useState(true);
  const [showSolarSystem, setShowSolarSystem] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getLearnCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch contents
  const fetchContents = useCallback(async () => {
    try {
      setIsLoadingContents(true);
      const response = await getLearnContents({
        category: selectedCategory || undefined,
        difficulty: difficulty || undefined,
        search: searchQuery || undefined,
      });
      setContents(response.data || []);
    } catch (err) {
      console.error('Failed to fetch contents:', err);
      setContents([]);
    } finally {
      setIsLoadingContents(false);
    }
  }, [selectedCategory, difficulty, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(fetchContents, 300);
    return () => clearTimeout(timer);
  }, [fetchContents]);

  // Stats
  const stats = useMemo(() => ({
    total: contents.length,
    beginner: contents.filter(c => c.difficulty === 'beginner').length,
    intermediate: contents.filter(c => c.difficulty === 'intermediate').length,
    advanced: contents.filter(c => c.difficulty === 'advanced').length,
  }), [contents]);

  return (
    <div className="min-h-screen bg-[#030014] text-white relative">
      <StarField />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="explore">
          
          {/* Categories Section */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Browse by Topic
                </h2>
                <p className="text-white/50">
                  Select a category to filter content
                </p>
              </div>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-4 py-2 text-sm text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-colors"
                >
                  Clear Filter ✕
                </button>
              )}
            </div>
            
            {/* Category Scroll */}
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                {isLoadingCategories ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="min-w-[200px] h-40 bg-white/5 rounded-2xl animate-pulse" />
                  ))
                ) : categories.length === 0 ? (
                  <div className="flex-1 text-center py-8 text-white/50">
                    No categories available yet. Check back soon!
                  </div>
                ) : (
                  categories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      isSelected={selectedCategory === category.id}
                      onClick={() => setSelectedCategory(
                        selectedCategory === category.id ? null : category.id
                      )}
                    />
                  ))
                )}
              </div>
            </div>
          </section>
          
          {/* Search & Filter Section */}
          <section className="mb-12">
            <div className="flex flex-col lg:flex-row gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for topics, articles, concepts..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
              
              {/* Difficulty Filter */}
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((level) => {
                  const config = {
                    beginner: { icon: '🌱', bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400' },
                    intermediate: { icon: '🌿', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400' },
                    advanced: { icon: '🌳', bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' },
                  }[level];
                  
                  const isSelected = difficulty === level;
                  
                  return (
                    <button
                      key={level}
                      onClick={() => setDifficulty(isSelected ? null : level)}
                      className={`
                        px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 border
                        ${isSelected 
                          ? `${config.bg} ${config.border} ${config.text}` 
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                        }
                      `}
                    >
                      <span>{config.icon}</span>
                      <span className="capitalize hidden sm:inline">{level}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
          
          {/* Results Header */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedCategory 
                    ? categories.find(c => c.id === selectedCategory)?.name || 'Articles' 
                    : 'All Articles'
                  }
                </h3>
                <p className="text-white/50 text-sm mt-1">
                  {stats.total} result{stats.total !== 1 ? 's' : ''} found
                  {difficulty && ` • ${difficulty} level`}
                  {searchQuery && ` • "${searchQuery}"`}
                </p>
              </div>
              
              {/* Stats Pills */}
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                  🌱 {stats.beginner}
                </span>
                <span className="px-3 py-1.5 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/20">
                  🌿 {stats.intermediate}
                </span>
                <span className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs font-medium rounded-full border border-red-500/20">
                  🌳 {stats.advanced}
                </span>
              </div>
            </div>
          </section>
          
          {/* Content Grid */}
          <section className="mb-20">
            {isLoadingContents ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <ContentSkeleton key={i} />)}
              </div>
            ) : contents.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
                <p className="text-white/50 mb-6 max-w-md mx-auto">
                  Try selecting a different category, adjusting your difficulty filter, or searching for something else.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setDifficulty(null);
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {contents.map((content, index) => (
                  <ContentCardNew key={content.id} content={content} index={index} />
                ))}
              </div>
            )}
          </section>
          
          {/* Solar System Section */}
          <section className="mb-20" id="solar-system">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a0a1a] to-[#1a0a2e]">
              {/* Header */}
              <div className="p-8 border-b border-white/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">🪐</span>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Interactive Solar System
                      </h2>
                    </div>
                    <p className="text-white/50 max-w-xl">
                      Explore our solar system in stunning 3D. Drag to rotate, scroll to zoom, 
                      and click on planets to discover fascinating facts about each world.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setShowSolarSystem(!showSolarSystem)}
                    className={`
                      px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2
                      ${showSolarSystem 
                        ? 'bg-white/10 text-white border border-white/20' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30'
                      }
                    `}
                  >
                    {showSolarSystem ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Hide Explorer
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Launch Explorer
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Solar System Container */}
              {showSolarSystem && (
                <div className="animate-fadeIn">
                  <SolarSystemExplorer />
                </div>
              )}
              
              {/* Preview if not shown */}
              {!showSolarSystem && (
                <div className="relative h-64 flex items-center justify-center overflow-hidden">
                  {/* Animated orbital preview */}
                  <div className="relative w-80 h-80">
                    <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-[spin_20s_linear_infinite]">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                    </div>
                    <div className="absolute inset-8 border border-yellow-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
                    </div>
                    <div className="absolute inset-16 border border-red-500/20 rounded-full animate-[spin_10s_linear_infinite]">
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-red-400 rounded-full shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full shadow-[0_0_40px_rgba(234,179,8,0.8)]" />
                    </div>
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-[#0a0a1a] opacity-80" />
                </div>
              )}
            </div>
          </section>
          
          {/* Bottom CTA */}
          <section className="text-center pb-12">
            <div className="inline-flex flex-col items-center p-8 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-3xl border border-white/10 backdrop-blur-sm">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to explore more?</h3>
              <p className="text-white/50 mb-6 max-w-md">
                Check out our events, missions, and cosmic weather updates to stay connected with the universe.
              </p>
              <div className="flex gap-4">
                <Link href="/events" className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors">
                  View Events
                </Link>
                <Link href="/missions" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                  Explore Missions
                </Link>
              </div>
            </div>
          </section>
          
        </main>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
