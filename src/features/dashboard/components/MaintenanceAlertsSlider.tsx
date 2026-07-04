'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { MaintenanceServiceAlert } from '@/features/dashboard'
import { useI18n } from '@/components/providers/I18nProvider'

interface MaintenanceAlertsSliderProps {
    services: MaintenanceServiceAlert[]
    overdueCount: number
    criticalCount: number
    totalAlerts: number
    tenantSlug: string
}

export default function MaintenanceAlertsSlider({ services, overdueCount, criticalCount, totalAlerts, tenantSlug }: MaintenanceAlertsSliderProps) {
    const { t } = useI18n()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    const nextSlide = useCallback(() => {
        if (isTransitioning || services.length === 0) return
        setIsTransitioning(true)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length)
        setTimeout(() => setIsTransitioning(false), 1000)
    }, [isTransitioning, services.length])

    const previousSlide = useCallback(() => {
        if (isTransitioning || services.length === 0) return
        setIsTransitioning(true)
        setCurrentIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length)
        setTimeout(() => setIsTransitioning(false), 1000)
    }, [isTransitioning, services.length])

    const goToSlide = useCallback((index: number) => {
        if (isTransitioning || services.length === 0) return
        setIsTransitioning(true)
        setCurrentIndex(index)
        setTimeout(() => setIsTransitioning(false), 1000)
    }, [isTransitioning, services.length])

    // Auto-advance every 8 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide()
        }, 8000)
        return () => clearInterval(timer)
    }, [nextSlide])

    const formatDate = (value: string | null | undefined): string => {
        if (!value) return 'N/A'
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return 'N/A'
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = '/assets/images/vehicle.png'
    }

    if (services.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-cyan-700">No maintenance alerts</p>
            </div>
        )
    }

    const getCurrentService = () => services[currentIndex]

    return (
        <div className="relative w-full overflow-hidden">
            {/* Service Cards Slider */}
            <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {services.map((service) => (
                    <div
                        key={service.maintenance_id}
                        className="w-full flex-shrink-0 p-4"
                    >
                        <div className="w-full max-w-sm mx-auto">
                            <div className="rounded-xl border-2 border-cyan-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                {/* Vehicle Image */}
                                <div className="relative h-40 mb-3 rounded-lg overflow-hidden bg-slate-100">
                                    <Image
                                        src={service.vehicle?.image || '/assets/images/vehicle.png'}
                                        alt={service.vehicle?.name || 'Unknown Vehicle'}
                                        width={320}
                                        height={160}
                                        className="w-full h-full object-cover"
                                        onError={handleImageError}
                                        unoptimized
                                    />
                                    <div className={`absolute top-2 right-2 px-2 py-1 text-white text-xs font-bold rounded-full ${
                                        service.is_overdue ? 'bg-red-500' : 'bg-blue-500'
                                    }`}>
                                        {service.is_overdue ? 'Overdue' : 'Upcoming'}
                                    </div>
                                </div>

                                {/* Service Info */}
                                <div className="mb-3">
                                    <p className="font-bold text-slate-900">{service.vehicle?.name || 'Unknown Vehicle'}</p>
                                    <p className="text-sm text-cyan-700">{service.category}</p>
                                    <p className="text-sm text-slate-600">{service.supplier?.name || '-'}</p>
                                </div>

                                {/* Due Date - Main Focus */}
                                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg px-4 py-3 border border-cyan-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-xs text-cyan-700 font-medium uppercase tracking-wide">Next Service</p>
                                            <p className="text-lg font-bold text-slate-900 mt-1">{formatDate(service.next_service_date)}</p>
                                        </div>
                                        <div className={`ml-2 px-3 py-1.5 rounded-lg text-sm font-bold ${
                                            service.is_overdue ? 'bg-red-500 text-white' : 'bg-cyan-500 text-white'
                                        }`}>
                                            {service.is_overdue ? `${service.days_overdue}d` : `${service.days_until_service}d`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {services.length > 1 && (
                <>
                    <button
                        onClick={previousSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-cyan-50 text-cyan-700 p-2 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-500 z-10"
                        aria-label="Previous service"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-cyan-50 text-cyan-700 p-2 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-500 z-10"
                        aria-label="Next service"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {services.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {services.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? 'w-8 bg-cyan-500'
                                    : 'w-2 bg-cyan-300 hover:bg-cyan-400'
                            }`}
                            aria-label={`Go to service ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
