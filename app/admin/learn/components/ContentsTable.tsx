'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LearnContent, LearnCategory } from '@/types/learn';
import { deleteContent } from '../actions';

interface ContentsTableProps {
  contents: LearnContent[];
  categories: LearnCategory[];
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function ContentsTable({ contents, categories }: ContentsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCategoryName = (categoryId: number | LearnCategory) => {
    if (typeof categoryId === 'object') return categoryId.name;
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    setError(null);

    const result = await deleteContent(id);
    
    if (result.error) {
      setError(result.error);
      setDeletingId(null);
    } else {
      router.refresh();
    }
  };

  if (contents.length === 0) {
    return (
      <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-8 text-center">
        <div className="text-4xl mb-3">📄</div>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">No content articles yet</p>
        <Link
          href="/admin/learn/contents/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
        >
          Create First Article
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Images
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {contents.map((content) => (
              <tr key={content.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-neutral-900 dark:text-white">
                      {content.title}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-500 truncate max-w-xs">
                      {content.description}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                  {getCategoryName(content.category)}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full capitalize ${difficultyColors[content.difficulty] || 'bg-neutral-100 text-neutral-600'}`}>
                    {content.difficulty}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                  {content.duration_minutes} min
                </td>
                <td className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                  {content.images?.length || 0}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/learn/${content.id}`}
                      target="_blank"
                      className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/learn/contents/${content.id}/edit`}
                      className="px-3 py-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(content.id, content.title)}
                      disabled={deletingId === content.id}
                      className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                    >
                      {deletingId === content.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
