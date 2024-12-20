'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/add-task', label: 'Add Task' },
    { href: '/tasks', label: 'Task List' },
    { href: '/history', label: 'Recently Completed & Deleted' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/about', label: 'About' },
    { href: '/auth/login', label: 'Login' },
    { href: '/auth/signup', label: 'Create Account' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full bg-[#5D4037] text-white">
        <div className="container flex h-14 items-center">
          <div className="mr-4 md:hidden">
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-[#4D3B3B] h-10 w-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="sr-only">Toggle Menu</span>
            </button>
          </div>
          <div className="flex-1 flex items-center md:justify-between justify-center">
            <Link href="/" className="text-3xl font-bold italic md:ml-8">
              do it
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-gray-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-14 z-50 bg-background md:hidden">
          <nav className="container grid gap-2 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <main className="container py-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 