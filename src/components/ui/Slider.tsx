'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { LucideIcon } from 'lucide-react'

interface Slide {
    id: number
    image: string
    title: string
    description?: string
    ctaText?: string
    ctaLink?: string
}

interface Feature {
    icon: LucideIcon
    heading: string
    description: string
    color?: string
}

interface SliderProps {
    slides: Slide[]
    autoplay?: boolean
    interval?: number
    showArrows?: boolean
    showDots?: boolean
    features?: Feature[]
    className?: string
}

export default function Slider({
    slides,
    autoplay = true,
    interval = 5000,
    showArrows = true,
    showDots = true,
    features = [],
    className = '',
}: SliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    const nextSlide = useCallback(() => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
        setTimeout(() => setIsTransitioning(false), 500)
    }, [isTransitioning, slides.length])

    const previousSlide = useCallback(() => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
        setTimeout(() => setIsTransitioning(false), 500)
    }, [isTransitioning, slides.length])

    const goToSlide = useCallback((index: number) => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentIndex(index)
        setTimeout(() => setIsTransitioning(false), 500)
    }, [isTransitioning])

    useEffect(() => {
        if (!autoplay) return

        const timer = setInterval(() => {
            nextSlide()
        }, interval)

        return () => clearInterval(timer)
    }, [autoplay, interval, nextSlide])

    if (slides.length === 0) {
        return null
    }

    return (
        <div className={`relative w-full overflow-hidden ${className}`}>
            {/* Slides Container */}
            <div
                className="flex transition-transform duration-500 ease-in-out h-[500px] md:h-[600px] lg:h-[700px]"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="w-full flex-shrink-0 relative"
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={currentIndex === slide.id - 1}
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                        <div className="absolute inset-0 flex items-center">
                            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                                <div className="max-w-2xl text-white">
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 animate-fade-in">
                                        {slide.title}
                                    </h2>
                                    {slide.description && (
                                        <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 animate-fade-in">
                                            {slide.description}
                                        </p>
                                    )}
                                    {slide.ctaText && slide.ctaLink && (
                                        <a
                                            href={slide.ctaLink}
                                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 md:px-10 md:py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                                        >
                                            {slide.ctaText}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Feature Cards Overlay */}
            {features.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 z-20">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-8 md:pb-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white/95 backdrop-blur-sm rounded-xl p-5 md:p-6 shadow-2xl transform hover:-translate-y-2 transition-all duration-300 hover:shadow-3xl"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${feature.color || 'from-blue-600 to-blue-700'} rounded-lg flex items-center justify-center shadow-lg`}>
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm md:text-base font-bold text-slate-900 mb-1 line-clamp-1">
                                                {feature.heading}
                                            </h3>
                                            <p className="text-xs md:text-sm text-slate-600 line-clamp-2">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Arrows */}
            {showArrows && slides.length > 1 && (
                <>
                    <button
                        onClick={previousSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-900 p-3 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {showDots && slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-3 rounded-full transition-all ${
                                index === currentIndex
                                    ? 'w-8 bg-white'
                                    : 'w-3 bg-white/50 hover:bg-white/70'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
