'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Menu, X } from 'lucide-react'

export function NavHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/wisdom', label: 'WISDOM' },
    { href: '/happenings', label: 'AI SAGES', authRequired: true },
    { href: '/newsletter', label: 'DAILY PREDICTION' },
    { href: '/profile/insights', label: 'INSIGHTS', authRequired: true },
    { href: '/matches', label: 'CONNECT', authRequired: true },
    { href: '/messages', label: 'MESSAGES', authRequired: true },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/30">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-semibold tracking-wide text-foreground">
              THE AI NEED.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks
              .filter((link) => !link.authRequired || user)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-widest transition-colors ${
                    isActive(link.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="w-20 h-8 bg-muted animate-pulse rounded" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Button
                  asChild
                  className="bg-[#9b8bb8] hover:bg-[#8a7aa7] text-background font-medium px-6"
                >
                  <Link href="/auth/sign-up">BEGIN JOURNEY</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/30">
            <div className="flex flex-col gap-4">
              {navLinks
                .filter((link) => !link.authRequired || user)
                .map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm tracking-widest transition-colors ${
                      isActive(link.href)
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              <div className="pt-4 border-t border-border/30 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm text-muted-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="justify-start px-0 text-muted-foreground"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-sm text-muted-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Button
                      asChild
                      className="bg-[#9b8bb8] hover:bg-[#8a7aa7] text-background font-medium"
                    >
                      <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>
                        BEGIN JOURNEY
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
