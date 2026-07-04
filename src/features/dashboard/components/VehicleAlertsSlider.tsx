'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { VehicleWithAlerts } from '@/features/dashboard'
import { useI18n } from '@/components/providers/I18nProvider'

interface VehicleAlertsSliderProps {
    vehicles: VehicleWithAlerts[]
    expiredCount: number
    totalAlerts: number
    tenantSlug: string
}

export default function VehicleAlertsSlider({ vehicles, expiredCount, totalAlerts, tenantSlug }: VehicleAlertsSliderProps) {
    const { t } = useI18n()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    const nextSlide = useCallback(() => {
        if (isTransitioning || vehicles.length === 0) return
        setIsTransitioning(true)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % vehicles.length)
        setTimeout(() => setIsTransitioning(false), 1000)
    }, [isTransitioning, vehicles.length])

    const previousSlide = useCallback(() => {
        if (isTransitioning || vehicles.length === 0) return
        setIsTransitioning(true)
        setCurrentIndex((prevIndex) => (prevIndex - 1 + vehicles.length) % vehicles.length)
        setTimeout(() => setIsTransitioning(false), 1000)
    }, [isTransitioning, vehicles.length])

    const goToSlide = useCallback((index: number) => {
        if (isTransitioning || vehicles.length === 0) return
        setIsTransitioning(true)
        setCurrentIndex(index)
        setTimeout(() => setIsTransitioning(false), 1000)
    }, [isTransitioning, vehicles.length])

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

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, fallbackSrc: string) => {
        e.currentTarget.src = fallbackSrc
    }

    if (vehicles.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-orange-700">No vehicle alerts</p>
            </div>
        )
    }

    // Group alerts by vehicle
    const getCurrentVehicle = () => vehicles[currentIndex]

    return (
        <div className="relative w-full overflow-hidden">
            {/* Vehicle Cards Slider */}
            <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {vehicles.map((vehicle) => (
                    <div
                        key={vehicle.vehicle_id}
                        className="w-full flex-shrink-0 px-4 py-4"
                    >
                        <div className="w-full max-w-sm mx-auto">
                            <div className="rounded-xl border-2 border-orange-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                {/* Vehicle Image */}
                                <div className="relative h-40 mb-3 rounded-lg overflow-hidden bg-slate-100">
                                    <Image
                                        src={vehicle.image || '/assets/images/vehicle.png'}
                                        alt={vehicle.vehicle_name}
                                        width={320}
                                        height={160}
                                        className="w-full h-full object-cover"
                                        onError={(e) => handleImageError(e, '/assets/images/vehicle.png')}
                                        unoptimized
                                    />
                                    {vehicle.alerts.some(a => a.is_expired) && (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                            Expired
                                        </div>
                                    )}
                                </div>

                                {/* Vehicle Info */}
                                <div className="mb-3">
                                    <p className="font-bold text-slate-900">{vehicle.vehicle_name}</p>
                                    <p className="text-sm text-slate-600">{vehicle.registration_no}</p>
                                    {vehicle.brand && vehicle.model && (
                                        <p className="text-xs text-slate-500">{vehicle.brand} {vehicle.model}</p>
                                    )}
                                </div>

                                {/* Alerts */}
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {vehicle.alerts.slice(0, 3).map((alert, index) => (
                                        <div key={index} className="text-xs flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
                                            <div className="flex-1">
                                                <span className="font-medium text-orange-800">{alert.type}</span>
                                                <p className="text-orange-600 mt-0.5">{formatDate(alert.expiry_date)}</p>
                                            </div>
                                            <div className="flex items-center gap-2 ml-2">
                                                <span className={`font-bold ${alert.is_expired ? 'text-red-600' : 'text-orange-900'}`}>
                                                    {alert.is_expired ? `${alert.days_overdue}d` : `${alert.days_until_expiry}d`}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${
                                                    alert.status === 'expired' ? 'bg-red-500 text-white' :
                                                    alert.status === 'critical' ? 'bg-orange-500 text-white' :
                                                    'bg-yellow-500 text-white'
                                                }`}>
                                                    {alert.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {vehicle.alerts.length > 3 && (
                                        <p className="text-xs text-center text-orange-600 italic">
                                            +{vehicle.alerts.length - 3} more alerts
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {vehicles.length > 1 && (
                <>
                    <button
                        onClick={previousSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-orange-50 text-orange-700 p-2 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 z-10"
                        aria-label="Previous vehicle"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-orange-50 text-orange-700 p-2 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 z-10"
                        aria-label="Next vehicle"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {vehicles.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {vehicles.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? 'w-8 bg-orange-500'
                                    : 'w-2 bg-orange-300 hover:bg-orange-400'
                            }`}
                            aria-label={`Go to vehicle ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
