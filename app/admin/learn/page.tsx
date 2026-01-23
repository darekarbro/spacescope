import { Suspense } from 'react';
import Link from 'next/link';
import { getCategories, getContents } from './actions';
import { CategoriesTable } from './components/CategoriesTable';
import { ContentsTable } from './components/ContentsTable';

export const dynamic = 'force-dynamic';

export default async function LearnAdminPage() {
  const [categoriesResult, contentsResult] = await Promise.all([
    getCategories(),
    getContents(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            📚 Learn Content Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage categories and learning content
          </p>
        </div>
        <Link
          href="/learn"
          className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
        >
          View Public Page →
        </Link>
      </div>

      {/* Categories Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>📂</span> Categories
          </h2>
          <Link
            href="/admin/learn/categories/new"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Add Category
          </Link>
        </div>
        
        {categoriesResult.error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
            {categoriesResult.error}
          </div>
        ) : (
          <Suspense fallback={<div className="animate-pulse h-40 bg-neutral-100 dark:bg-neutral-800 rounded-lg" />}>
            <CategoriesTable categories={categoriesResult.categories} />
          </Suspense>
        )}
      </section>

      {/* Contents Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>📄</span> Content Articles
          </h2>
          <Link
            href="/admin/learn/contents/new"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Add Content
          </Link>
        </div>
        
        {contentsResult.error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
            {contentsResult.error}
          </div>
        ) : (
          <Suspense fallback={<div className="animate-pulse h-60 bg-neutral-100 dark:bg-neutral-800 rounded-lg" />}>
            <ContentsTable contents={contentsResult.contents} categories={categoriesResult.categories} />
          </Suspense>
        )}
      </section>
    </div>
  );
}
