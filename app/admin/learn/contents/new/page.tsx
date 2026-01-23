import Link from 'next/link';
import { getCategories } from '../../actions';
import { ContentForm } from '../../components/ContentForm';

export const dynamic = 'force-dynamic';

export default async function NewContentPage() {
  const { categories } = await getCategories();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-neutral-500">
          <li>
            <Link href="/admin/learn" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Learn Management
            </Link>
          </li>
          <li>/</li>
          <li className="text-neutral-900 dark:text-white">New Content</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
        Create New Content
      </h1>

      {categories.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
          <p className="text-yellow-700 dark:text-yellow-400 mb-4">
            You need to create at least one category before adding content.
          </p>
          <Link
            href="/admin/learn/categories/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
          >
            Create Category First
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
          <ContentForm categories={categories} />
        </div>
      )}
    </div>
  );
}
