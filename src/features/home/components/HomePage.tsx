'use client'

import { useState } from 'react'
import Slider from '@/components/ui/Slider'
import LogoCarousel from '@/components/ui/LogoCarousel'
import TestimonialCarousel from '@/components/ui/TestimonialCarousel'
import { Truck, Bus, Car, Building2, TrendingUp, Shield, Clock, Users, Route, FileText, DollarSign, ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

export default function HomePage() {
    const [email, setEmail] = useState('')

    const sliderFeatures = [
        {
            icon: Truck,
            heading: 'Fleet Management',
            description: 'Track and manage your entire fleet in real-time with GPS tracking and maintenance schedules.',
            color: 'from-purple-600 to-indigo-600',
        },
        {
            icon: Route,
            heading: 'Route Optimization',
            description: 'Smart route planning reduces fuel costs and improves delivery times by up to 30%.',
            color: 'from-blue-900 to-indigo-900',
        },
        {
            icon: DollarSign,
            heading: 'Billing & Invoicing',
            description: 'Automated billing system with multiple payment options and instant invoice generation.',
            color: 'from-purple-600 to-indigo-600',
        },
        {
            icon: FileText,
            heading: 'Driver Management',
            description: 'Complete driver profiles, document management, and performance tracking.',
            color: 'from-blue-900 to-indigo-900',
        },
    ]

    const slides = [
        {
            id: 1,
            image: '/assets/images/slider/slider1.jpg',
            title: 'Transform Your Business',
            description: 'Powerful SaaS platform that digitizes and optimizes operations for trucks, buses, rent-a-car services, and corporate fleets.',
            ctaText: 'Start Free Trial',
            ctaLink: '#contact',
        },
        {
            id: 2,
            image: '/assets/images/slider/slider2.webp',
            title: 'All-in-One Fleet Management',
            description: 'Streamline your operations with comprehensive tools for tracking, billing, maintenance, and driver management.',
            ctaText: 'Explore Features',
            ctaLink: '#features',
        },
    ]

    const clientLogos = [
        { id: 1, name: 'Express Logistics', logo: 'https://placehold.co/150x60/png?text=Express+Logistics' },
        { id: 2, name: 'Swift Transport', logo: 'https://placehold.co/150x60/png?text=Swift+Transport' },
        { id: 3, name: 'City Bus Lines', logo: 'https://placehold.co/150x60/png?text=City+Bus+Lines' },
        { id: 4, name: 'Metro Delivery', logo: 'https://placehold.co/150x60/png?text=Metro+Delivery' },
        { id: 5, name: 'Fast Freight', logo: 'https://placehold.co/150x60/png?text=Fast+Freight' },
        { id: 6, name: 'Global Shipping', logo: 'https://placehold.co/150x60/png?text=Global+Shipping' },
        { id: 7, name: 'Premium Rentals', logo: 'https://placehold.co/150x60/png?text=Premium+Rentals' },
        { id: 8, name: 'Elite Fleet', logo: 'https://placehold.co/150x60/png?text=Elite+Fleet' },
    ]

    const testimonials = [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Operations Manager',
            company: 'Express Logistics',
            content: 'democompany has transformed how we manage our fleet. We have reduced operational costs by 35% and improved delivery times significantly. The real-time tracking feature is a game-changer.',
            rating: 5,
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Fleet Director',
            company: 'Swift Transport',
            content: 'The billing automation alone has saved us countless hours every week. Our drivers love the mobile app, and management has full visibility into all operations. Highly recommended!',
            rating: 5,
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            role: 'CEO',
            company: 'City Bus Lines',
            content: 'We manage over 200 buses across multiple cities. democompany\'s route optimization and scheduling features have helped us reduce fuel consumption by 25% while improving on-time performance.',
            rating: 5,
        },
        {
            id: 4,
            name: 'David Thompson',
            role: 'Owner',
            company: 'Premium Rentals',
            content: 'The rental management features are exactly what we needed. Booking, payments, and vehicle tracking are all integrated seamlessly. Our customers love the transparency.',
            rating: 5,
        },
        {
            id: 5,
            name: 'Lisa Anderson',
            role: 'Logistics Manager',
            company: 'Metro Delivery',
            content: 'Implementation was smooth, and the support team was incredibly helpful. Within weeks, we saw improvements in driver productivity and customer satisfaction scores.',
            rating: 5,
        },
    ]

    const features = [
        {
            icon: Truck,
            title: 'Truck Management',
            description: 'Optimize truck operations with advanced tracking, route planning, and load management.',
        },
        {
            icon: Bus,
            title: 'Bus Fleet Control',
            description: 'Manage bus schedules, routes, passenger tracking, and maintenance seamlessly.',
        },
        {
            icon: Car,
            title: 'Rent-a-Car Solutions',
            description: 'Simplify rental operations with booking systems, payment processing, and fleet tracking.',
        },
        {
            icon: Building2,
            title: 'Corporate Fleets',
            description: 'Efficiently manage company vehicles, driver assignments, and expense tracking.',
        },
    ]

    const benefits = [
        {
            icon: TrendingUp,
            title: 'Increase Efficiency',
            description: 'Reduce operational costs by up to 40% with automated workflows and smart scheduling.',
        },
        {
            icon: Shield,
            title: 'Enhanced Security',
            description: 'Protect your assets with real-time monitoring and comprehensive audit trails.',
        },
        {
            icon: Clock,
            title: 'Save Time',
            description: 'Eliminate manual processes and focus on growing your business.',
        },
        {
            icon: Users,
            title: 'Better Team Coordination',
            description: 'Connect drivers, dispatchers, and management with instant communication tools.',
        },
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle newsletter subscription
        console.log('Subscribed:', email)
        setEmail('')
    }

    return (
        <div className="w-full">
            {/* Hero Slider Section */}
            <section className="relative">
                <Slider
                    slides={slides}
                    autoplay
                    interval={6000}
                    features={sliderFeatures}
                />
            </section>

            {/* Client Logo Carousel */}
            <section>
                <LogoCarousel logos={clientLogos} speed={40} direction="left" />
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Powerful Features for Every Fleet Type
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Our comprehensive platform adapts to your specific transport business needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300 bg-white"
                            >
                                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors duration-300">
                                    <feature.icon className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Why Choose democompany?
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Delivering measurable results for transport businesses worldwide
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="text-center p-6"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <benefit.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-slate-600">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials">
                <TestimonialCarousel testimonials={testimonials} autoplay interval={6000} />
            </section>

            {/* CTA Section */}
            <section id="contact" className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                            Ready to Transform Your Fleet Operations?
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join hundreds of transport companies already using democompany to drive efficiency and growth
                        </p>
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="flex-1 px-6 py-4 rounded-lg text-slate-900 focus:outline-none focus:ring-4 focus:ring-white/30"
                            />
                            <button
                                type="submit"
                                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
                            >
                                Get Started
                            </button>
                        </form>
                        <p className="text-sm mt-4 opacity-75">
                            No credit card required • 14-day free trial • Cancel anytime
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}