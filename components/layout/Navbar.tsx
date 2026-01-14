'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/Button';
import ThemeToggle from '@/components/ThemeToggle';
import { Globe } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Globe className="h-6 w-6" />
            <span>SpaceScope</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-foreground hover:text-primary">
              Events
            </Link>
            <Link href="/cosmic-weather" className="text-foreground hover:text-primary">
              Cosmic Weather
            </Link>
            <Link href="/missions" className="text-foreground hover:text-primary">
              Missions
            </Link>
            <Link href="/earth-impact" className="text-foreground hover:text-primary">
              Earth Impact
            </Link>
            <Link href="/learn" className="text-foreground hover:text-primary">
              Learn
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">{user.name}</span>
                  {user.role === 'scientist' && (
                    <Link href="/scientist" className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      Admin
                    </Link>
                  )}
                </div>
                <Button size="sm" variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button size="sm" variant="ghost">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
