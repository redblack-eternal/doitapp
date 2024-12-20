'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const result = await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  const isActive = (path) => pathname === path;

  const commonMenuItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact Us' },
  ];

  const authenticatedMenuItems = [
    { href: '/add-task', label: 'Add Task' },
    { href: '/tasks', label: 'Task List' },
    { href: '/history', label: 'Recently Completed' },
    { href: '/profile', label: session?.user?.email },
  ];

  const menuItems = session 
    ? [...commonMenuItems, ...authenticatedMenuItems]
    : commonMenuItems;

  return (
    <nav className="bg-gradient-to-b from-[#4a1c24] to-[#3d171d] text-white shadow-lg border-b border-[#2a1114]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-[#5c232d] active:bg-[#4a1c24] h-10 w-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          {/* Logo - centered on mobile */}
          <div className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-0 md:transform-none">
            <Link 
              href="/" 
              className="text-3xl font-bold italic tracking-wide text-white hover:text-gray-200 transition-colors"
            >
              do it
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-gray-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:bg-gray-200 ${
                  isActive(item.href) ? 'text-gray-200 after:w-full' : 'text-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {session && (
              <button
                onClick={handleSignOut}
                className="text-sm font-medium hover:text-gray-200 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu with smooth transition */}
      <div 
        className={`md:hidden bg-[#3d171d] border-t border-[#2a1114] overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive(item.href) 
                  ? 'bg-[#5c232d] text-white' 
                  : 'text-gray-100 hover:bg-[#5c232d] hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {session && (
            <button
              onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-100 hover:bg-[#5c232d] hover:text-white transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
} 