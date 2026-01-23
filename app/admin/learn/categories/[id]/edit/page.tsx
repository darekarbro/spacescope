import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategory } from '../../../actions';
import { CategoryForm } from '../../../components/CategoryForm';

export const dynamic = 'force-dynamic';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const { category, error } = await getCategory(Number(id));

  if (error || !category) {
    notFound();
  }

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
          <li className="text-neutral-900 dark:text-white">Edit Category</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
        Edit Category: {category.name}
      </h1>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
        <CategoryForm category={category} isEdit />
      </div>
    </div>
  );
}
