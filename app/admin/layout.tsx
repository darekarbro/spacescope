'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ADMIN_LINKS = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Missions', href: '/admin/missions' },
  { name: 'Events', href: '/admin/events' },
  { name: 'Learn', href: '/admin/learn' },
  { name: 'Scientists', href: '/admin/scientists' },
  { name: 'Reports', href: '/admin/reports' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Admin Navigation Bar */}
      <nav className="bg-indigo-600 dark:bg-indigo-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="font-bold text-xl">
                🚀 SpaceScope Admin
              </Link>
              <div className="hidden md:flex items-center gap-1">
                {ADMIN_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      pathname === link.href
                        ? 'bg-indigo-700 dark:bg-indigo-800'
                        : 'hover:bg-indigo-500 dark:hover:bg-indigo-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm hover:underline"
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-indigo-500 px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {ADMIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 rounded text-sm ${
                  pathname === link.href
                    ? 'bg-indigo-700 dark:bg-indigo-800'
                    : 'hover:bg-indigo-500 dark:hover:bg-indigo-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
