"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Create Lead', href: '/buyers/new' },
  { name: 'Buyers List', href: '/buyers' },
  { name: 'Import CSV', href: '/buyers/import' },
  { name: 'Export CSV', href: '/buyers/export' },
];

// Mock user for demo - in real app this would come from authentication
const currentUser = {
  id: 'user-demo-1',
  name: 'Demo User',
  role: 'Agent'
};

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border-b border-blue-300 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div>
              <Link href="/" className="text-xl font-bold text-white hover:text-blue-100 transition-colors">
                LeadFlow
              </Link>
              <div className="text-xs text-blue-200 -mt-1">Buyer Management</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-md transform scale-105'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white p-2 rounded-lg hover:bg-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <div className="flex flex-col">
                <div className="text-xs text-white/70 uppercase tracking-wider font-medium">
                  {currentUser.role}
                </div>
                <div className="text-sm text-white font-medium">
                  {currentUser.name}
                </div>
                <div className="text-xs text-white/70 font-mono">
                  ID: {currentUser.id}
                </div>
              </div>
            </div>

            {/* User Avatar */}
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-lg">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>

            <div className="hidden lg:block text-sm text-white/60 px-2">
              v1.0
            </div>
          </div>
        </div>

        {/* Enhanced User Information Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 rounded-b-lg border-l-4 border-white shadow-inner">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="text-sm text-white">
              Welcome back! You can edit/delete buyers where owner ID matches yours
              <span className="font-mono ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                {currentUser.id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
