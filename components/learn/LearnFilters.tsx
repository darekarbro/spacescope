'use client';

import React from 'react';
import type { DifficultyLevel } from '@/types/learn';

interface DifficultyFilterProps {
  selected: DifficultyLevel | null;
  onChange: (difficulty: DifficultyLevel | null) => void;
}

const difficulties: { value: DifficultyLevel | null; label: string; emoji: string }[] = [
  { value: null, label: 'All Levels', emoji: '📚' },
  { value: 'beginner', label: 'Beginner', emoji: '🌱' },
  { value: 'intermediate', label: 'Intermediate', emoji: '🌿' },
  { value: 'advanced', label: 'Advanced', emoji: '🌳' },
];

export function DifficultyFilter({ selected, onChange }: DifficultyFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {difficulties.map(({ value, label, emoji }) => (
        <button
          key={label}
          onClick={() => onChange(value)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            flex items-center gap-2
            ${selected === value
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
              : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/30 hover:text-white'
            }
          `}
        >
          <span>{emoji}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search topics...' }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
