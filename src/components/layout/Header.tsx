'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import {IconType} from "react-icons";
import {FaRegNewspaper} from "react-icons/fa"
import {MdLiveTv} from "react-icons/md"
import Image from "next/image";
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { useI18n } from '@/components/providers/I18nProvider'


interface NavItem {
    name: string
    href?: string
    icon?: IconType
    children?: NavItem[]
}

export default function Header() {
    const { loading } = useAuthStore()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobileSubmenus, setMobileSubmenus] = useState<string[]>([])
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const { t } = useI18n()

    const navLinks: NavItem[] = [

        { name: t('header', 'home'), href: '/' ,icon: MdLiveTv},
        { name: t('header', 'about'), href: '/about-us' ,icon: MdLiveTv},
        { name: t('header', 'services'), href: '/services' ,icon: MdLiveTv},
        { name: t('header', 'pricing'), href: '/pricing' ,icon: MdLiveTv},
        { name: t('header', 'contact'), href: '/contact-us' ,icon: MdLiveTv},
        { name: t('header', 'blogs'), href: '/blogs', icon: FaRegNewspaper, },
    ]

    const handleMouseEnter = (name: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setHoveredMenu(name)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setHoveredMenu(null)
        }, 200)
    }

    const toggleMobileSubmenu = (name: string) => {
        setMobileSubmenus((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        )
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    if (loading) return null

    return (
        <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Left: Hamburger + Logo */}
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden p-2 rounded hover:bg-gray-100 transition"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-label={t('header', 'toggleMenu')}
                    >
                        <div className="w-5 h-4 flex flex-col justify-between">
                            <span className={`block w-5 h-0.5 bg-purple-800 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                            <span className={`block w-5 h-0.5 bg-purple-800 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                            <span className={`block w-5 h-0.5 bg-purple-800 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                        </div>
                    </button>

                    <Link href="/" className="flex items-center">
                        <Image
                            src={'/logo.png'}
                            alt={'Admin SaaS'}
                            width={140}  // Set your actual pixel width
                            height={40}  // Set your actual pixel height
                            className="w-auto h-12 md:h-16" // Responsive height using Tailwind
                            priority
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 relative">
                    {navLinks.map((link) =>
                            !link.children ? (
                                <Link
                                    key={link.name}
                                    href={link.href!}
                                    className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    {link.icon && <link.icon className="text-base" />}
                                    {link.name}
                                </Link>
                            ) : (
                                <div
                                    key={link.name}
                                    className="relative"
                                    onMouseEnter={() => handleMouseEnter(link.name)}
                                    onMouseLeave={handleMouseLeave}
                                >
                <span className="text-sm font-medium hover:text-purple-700 cursor-pointer transition-colors flex items-center gap-2">
                  {link.icon && <link.icon className="text-base" />}
                    {link.name}
                    <svg className={`w-3 h-3 transition-transform duration-200 ${hoveredMenu === link.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>

                                    {hoveredMenu === link.name && (
                                        <div
                                            className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg min-w-[180px] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                                            onMouseEnter={() => handleMouseEnter(link.name)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            {link.children.map((child, idx) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.href!}
                                                    className={`block px-4 py-3 text-sm whitespace-nowrap hover:bg-[#203F6F] hover:text-white transition-colors ${idx !== link.children!.length - 1 ? 'border-b border-gray-100' : ''}`}
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                    )}
                </nav>

                {/* Auth menu */}
                <div className="flex items-center gap-3 relative">
                    <LanguageSwitcher />
                    <Link href="/contact-us" className="text-sm font-medium bg-purple-700 hover:text-primary transition-colors px-4 py-2 border border-primary rounded-lg hover:bg-primary text-white hover:text-white">
                        {t('header', 'getStarted')}
                    </Link>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-screen border-t' : 'max-h-0'}`}>
                <nav className="bg-gray-50 flex flex-col">
                    <div className="border-b border-gray-200 px-4 py-3">
                        <LanguageSwitcher className="block w-full" />
                    </div>
                    {navLinks.map((link) =>
                        !link.children ? (
                            <Link
                                key={link.name}
                                href={link.href!}
                                className="text-sm font-medium hover:bg-white hover:text-primary px-4 py-3 transition-colors border-b border-gray-200 "
                                onClick={() => setMobileOpen(false)}
                            >
                                <span className="flex items-center gap-2">
                                    {link.icon && <link.icon className="text-base" />}
                                    {link.name}
                                </span>
                            </Link>
                        ) : (
                            <div key={link.name} className="border-b border-gray-200">
                                <button
                                    className="text-sm font-medium flex justify-between items-center w-full px-4 py-3 hover:bg-white transition-colors"
                                    onClick={() => toggleMobileSubmenu(link.name)}
                                >
                                    <span>{link.name}</span>
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${mobileSubmenus.includes(link.name) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${mobileSubmenus.includes(link.name) ? 'max-h-96' : 'max-h-0'}`}>
                                    <div className="bg-white">
                                        {link.children?.map((child, childIdx) => (
                                            <Link
                                                key={child.name}
                                                href={child.href!}
                                                className={`block pl-8 pr-4 py-3 text-sm hover:bg-primary hover:text-white transition-colors ${childIdx !== link.children!.length - 1 ? 'border-b border-gray-100' : ''}`}
                                                onClick={() => setMobileOpen(false)}
                                            >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                            {child.name}
                        </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </nav>
            </div>
        </header>
    )
}
