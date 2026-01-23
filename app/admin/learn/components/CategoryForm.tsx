'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { LearnCategory } from '@/types/learn';
import { createCategory, updateCategory } from '../actions';

interface CategoryFormProps {
  category?: LearnCategory;
  isEdit?: boolean;
}

export function CategoryForm({ category, isEdit = false }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const result = isEdit && category
      ? await updateCategory(category.id, formData)
      : await createCategory(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push('/admin/learn');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Category Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={category?.name || ''}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="e.g., Basics of Space"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={category?.description || ''}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Brief description of the category"
        />
      </div>

      <div>
        <label htmlFor="icon" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Icon URL (optional)
        </label>
        <input
          type="url"
          id="icon"
          name="icon"
          defaultValue={category?.icon_url || ''}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="https://example.com/icon.png"
        />
        <p className="mt-1 text-sm text-neutral-500">Leave empty to use default icon</p>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
        </button>
        <Link
          href="/admin/learn"
          className="px-6 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
