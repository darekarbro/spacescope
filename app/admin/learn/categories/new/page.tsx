import Link from 'next/link';
import { CategoryForm } from '../../components/CategoryForm';

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-neutral-500">
          <li>
            <Link href="/admin/learn" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Learn Management
            </Link>
          </li>
          <li>/</li>
          <li className="text-neutral-900 dark:text-white">New Category</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
        Create New Category
      </h1>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
        <CategoryForm />
      </div>
    </div>
  );
}
