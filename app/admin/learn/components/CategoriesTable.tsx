'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LearnCategory } from '@/types/learn';
import { deleteCategory } from '../actions';

interface CategoriesTableProps {
  categories: LearnCategory[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    setError(null);

    const result = await deleteCategory(id);
    
    if (result.error) {
      setError(result.error);
      setDeletingId(null);
    } else {
      router.refresh();
    }
  };

  if (categories.length === 0) {
    return (
      <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-8 text-center">
        <div className="text-4xl mb-3">📂</div>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">No categories yet</p>
        <Link
          href="/admin/learn/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
        >
          Create First Category
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
      <table className="w-full">
        <thead className="bg-neutral-50 dark:bg-neutral-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Created
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  {category.icon_url ? (
                    <img src={category.icon_url} alt="" className="w-8 h-8 rounded" />
                  ) : (
                    <span className="text-2xl">🌌</span>
                  )}
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {category.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
                {category.description}
              </td>
              <td className="px-4 py-4 text-sm text-neutral-500 dark:text-neutral-500">
                {new Date(category.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/learn/categories/${category.id}/edit`}
                    className="px-3 py-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    disabled={deletingId === category.id}
                    className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                  >
                    {deletingId === category.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
