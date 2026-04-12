'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  FileText,
  Menu,
  Route,
  Settings
} from 'lucide-react';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', icon: Calculator, label: 'Flow Diagnostics' },
    { href: '/dashboard/route-review', icon: Route, label: 'Route Review' },
    { href: '/dashboard/resources', icon: FileText, label: 'Resources' },
    { href: '/dashboard/account', icon: Settings, label: 'Account' }
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-68px)] w-full max-w-7xl flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 lg:hidden">
        <div className="flex items-center">
          <span className="font-medium">Member dashboard</span>
        </div>
        <Button
          className="-mr-3"
          variant="ghost"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex h-full flex-1 overflow-hidden">
        <aside
          className={`w-64 border-r border-gray-200 bg-white lg:block lg:bg-gray-50 ${
            isSidebarOpen ? 'block' : 'hidden'
          } absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="h-full overflow-y-auto p-4">
            {navItems.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link key={item.href} href={item.href} passHref>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`my-1 w-full justify-start shadow-none ${
                      isActive ? 'bg-gray-100 text-gray-950' : 'text-gray-600'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-0 lg:p-4">{children}</main>
      </div>
    </div>
  );
}
