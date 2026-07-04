'use client'

import Link from 'next/link'
import { useI18n } from '@/components/providers/I18nProvider'
import { Facebook, Youtube, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
    const { t } = useI18n()

    return (
        <footer className="bg-purple-800 text-white mt-12">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                            democompany
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Transforming transport businesses with powerful fleet management solutions. Track, optimize, and grow your operations with ease.
                        </p>
                        {/* Social Media Icons */}
                        <div className="flex gap-3 mt-6">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-[#4CAF50] rounded-full flex items-center justify-center transition-all duration-300 group"
                            >
                                <Facebook className="w-5 h-5 text-white group-hover:text-white" />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-[#4CAF50] rounded-full flex items-center justify-center transition-all duration-300 group"
                            >
                                <Youtube className="w-5 h-5 text-white group-hover:text-white" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-[#4CAF50] rounded-full flex items-center justify-center transition-all duration-300 group"
                            >
                                <Instagram className="w-5 h-5 text-white group-hover:text-white" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-[#4CAF50] rounded-full flex items-center justify-center transition-all duration-300 group"
                            >
                                <Linkedin className="w-5 h-5 text-white group-hover:text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">
                            QUICK LINKS
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-[#4CAF50] transition-colors duration-300 text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about-us" className="text-gray-400 hover:text-[#4CAF50] transition-colors duration-300 text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-gray-400 hover:text-[#4CAF50] transition-colors duration-300 text-sm">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact-us" className="text-gray-400 hover:text-[#4CAF50] transition-colors duration-300 text-sm">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/blogs" className="text-gray-400 hover:text-[#4CAF50] transition-colors duration-300 text-sm">
                                    Blogs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services/Models */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">
                            SERVICES
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/features" className="text-gray-400 hover:text-[#4CAF50] transition-colors duration-300 text-sm">
                                    Fleet Management
                                </Link>
                            </li>
                            <li>
                                <Link href="/features" className="text-gray-400 hover:text-[#4CAF50] transition-colors duration-300 text-sm">
                                    Route Optimization
                                </Link>
                            </li>
                            <li>
                                <Link href="/features" className="text-gray-400 hover:text-[#4CAF50] transition-colors duration-300 text-sm">
                                    Driver Management
                                </Link>
                            </li>
                            <li>
                                <Link href="/features" className="text-gray-400 hover:text-[#4CAF50] transition-colors duration-300 text-sm">
                                    Billing & Invoicing
                                </Link>
                            </li>
                            <li>
                                <Link href="/features" className="text-gray-400 hover:text-[#4CAF50] transition-colors duration-300 text-sm">
                                    Maintenance Tracking
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">
                            CONTACT US
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Phone</p>
                                    <a href="tel:+1234567890" className="text-white hover:text-[#4CAF50] transition-colors duration-300 font-semibold">
                                        +1 (234) 567-890
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Email</p>
                                    <a href="mailto:info@democompany.com" className="text-white hover:text-[#4CAF50] transition-colors duration-300 font-semibold">
                                        info@democompany.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Address</p>
                                    <p className="text-white text-sm leading-relaxed">
                                        123 Business Street<br />
                                        Suite 100, New York, NY 10001
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            © {new Date().getFullYear()} democompany. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="/privacy-policy" className="text-gray-400 hover:text-[#4CAF50] transition-colors duration-300">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-and-conditions" className="text-gray-400 hover:text-[#4CAF50] transition-colors duration-300">
                                Terms & Conditions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer >
    )
}
