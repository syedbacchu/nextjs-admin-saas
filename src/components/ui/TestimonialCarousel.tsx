'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

interface Testimonial {
    id: number
    name: string
    role: string
    company: string
    image?: string
    content: string
    rating: number
}

interface TestimonialCarouselProps {
    testimonials: Testimonial[]
    autoplay?: boolean
    interval?: number
    className?: string
}

export default function TestimonialCarousel({
    testimonials,
    autoplay = true,
    interval = 5000,
    className = '',
}: TestimonialCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const previousTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    useEffect(() => {
        if (!autoplay) return

        const timer = setInterval(() => {
            nextTestimonial()
        }, interval)

        return () => clearInterval(timer)
    }, [autoplay, interval])

    if (testimonials.length === 0) {
        return null
    }

    return (
        <div className={`py-20 bg-slate-50 ${className}`}>
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                        What Our Clients Say
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Don't just take our word for it – hear from the businesses we've helped transform
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Main Testimonial Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
                        {/* Quote Icon */}
                        <div className="absolute top-4 right-4 text-purple-100">
                            <Quote className="w-24 h-24" />
                        </div>

                        {/* Rating Stars */}
                        <div className="flex mb-6">
                            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 fill-purple-500 text-purple-500" />
                            ))}
                        </div>

                        {/* Testimonial Content */}
                        <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed">
                            "{testimonials[currentIndex].content}"
                        </p>

                        {/* Author Info */}
                        <div className="flex items-center gap-4">
                            {testimonials[currentIndex].image ? (
                                <img
                                    src={testimonials[currentIndex].image}
                                    alt={testimonials[currentIndex].name}
                                    className="w-16 h-16 rounded-full object-cover border-4 border-purple-100"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {testimonials[currentIndex].name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h4 className="text-lg font-bold text-slate-900">
                                    {testimonials[currentIndex].name}
                                </h4>
                                <p className="text-slate-600">
                                    {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={previousTestimonial}
                            className="bg-white hover:bg-purple-600 text-slate-900 hover:text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextTestimonial}
                            className="bg-white hover:bg-purple-600 text-slate-900 hover:text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Dot Indicators */}
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full transition-all ${
                                    index === currentIndex ? 'w-8 bg-purple-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                                }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Client Logos Grid (Optional) */}
                {testimonials.length > 3 && (
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {testimonials.slice(0, 4).map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm"
                            >
                                {testimonial.image ? (
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{testimonial.name}</p>
                                    <p className="text-xs text-slate-600 truncate">{testimonial.company}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
