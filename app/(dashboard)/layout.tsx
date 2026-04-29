'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Home, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FlowSignalLogo } from '@/components/brand/flowsignal-logo';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import type { SafeUser } from '@/lib/auth/safe-user';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const publicNavItems = [
  { href: '/', label: 'Home' },
  { href: '/intelligence', label: 'Intelligence' },
  { href: '/for-accountants', label: 'For Accountants' },
  { href: '/insights', label: 'Insights' }
];

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useSWR<SafeUser>('/api/user', fetcher);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

  if (!user) {
    return (
      <Button
        asChild
        className="rounded-xl bg-[#155EEF] text-white hover:bg-[#0F4CD1]"
      >
        <Link href="/sign-in">Login</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback>
            {user.email
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Member dashboard</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  return (
    <header className="border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <FlowSignalLogo />
        <div className="flex items-center gap-5">
          <nav className="hidden items-center gap-6 md:flex">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#64748B] transition-colors hover:text-[#08111F]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 rounded-t-[32px] bg-[#071225]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-lg font-semibold text-white">FlowSignal</span>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              Neutral cross-border flow intelligence for professional advisory
              teams.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">
              Navigation
            </p>
            <ul className="mt-4 space-y-3">
              {publicNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">
              Product
            </p>
            <ul className="mt-4 space-y-3">
              {[
                { href: '/dashboard', label: 'Flow Diagnostics' },
                { href: '/dashboard/scenarios', label: 'Scenarios' },
                { href: '/dashboard/route-review', label: 'Route Review' },
                { href: '/dashboard/resources', label: 'Resources' }
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">
              Access
            </p>
            <ul className="mt-4 space-y-3">
              {[
                { href: '/sign-in', label: 'Sign In' },
                { href: '/sign-up', label: 'Create Access' }
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} FlowSignal. Not a payment processor.
            For advisory and review purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </section>
  );
}
