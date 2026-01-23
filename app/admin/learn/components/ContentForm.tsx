'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { LearnContent, LearnCategory, LearnContentImage } from '@/types/learn';
import { createContent, updateContent } from '../actions';

interface ContentFormProps {
  content?: LearnContent;
  categories: LearnCategory[];
  isEdit?: boolean;
}

export function ContentForm({ content, categories, isEdit = false }: ContentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<Partial<LearnContentImage>[]>(
    content?.images || []
  );

  const getCategoryId = () => {
    if (!content?.category) return '';
    if (typeof content.category === 'object') return content.category.id;
    return content.category;
  };

  const handleAddImage = () => {
    setImages([...images, { image_url: '', caption: '', order: images.length + 1 }]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange = (index: number, field: keyof LearnContentImage, value: string | number) => {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: value };
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('images', JSON.stringify(images));

    const result = isEdit && content
      ? await updateContent(content.id, formData)
      : await createContent(formData);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={content?.title || ''}
            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., What is a Galaxy?"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={getCategoryId()}
            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Short Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={2}
          defaultValue={content?.description || ''}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Brief description for preview cards"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Difficulty *
          </label>
          <select
            id="difficulty"
            name="difficulty"
            required
            defaultValue={content?.difficulty || 'beginner'}
            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="beginner">🌱 Beginner</option>
            <option value="intermediate">🌿 Intermediate</option>
            <option value="advanced">🌳 Advanced</option>
          </select>
        </div>

        <div>
          <label htmlFor="duration_minutes" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Duration (minutes) *
          </label>
          <input
            type="number"
            id="duration_minutes"
            name="duration_minutes"
            required
            min="1"
            defaultValue={content?.duration_minutes || 5}
            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Content *
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={12}
          defaultValue={content?.content || ''}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
          placeholder="Full article content. You can use plain text with line breaks."
        />
        <p className="mt-1 text-sm text-neutral-500">Line breaks will be preserved when displayed.</p>
      </div>

      {/* Images Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Images
          </label>
          <button
            type="button"
            onClick={handleAddImage}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            + Add Image
          </button>
        </div>

        {images.length === 0 ? (
          <p className="text-sm text-neutral-500 italic">No images added yet</p>
        ) : (
          <div className="space-y-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Image {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="url"
                      value={image.image_url || ''}
                      onChange={(e) => handleImageChange(index, 'image_url', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm"
                      placeholder="Image URL"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={image.order || index + 1}
                      onChange={(e) => handleImageChange(index, 'order', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm"
                      placeholder="Order"
                      min="1"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      value={image.caption || ''}
                      onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm"
                      placeholder="Caption (optional)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Content' : 'Create Content'}
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
