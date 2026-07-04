'use client'

import { useEffect, useState } from 'react'

interface ClientLogo {
    id: number
    name: string
    logo: string
    width?: number
    height?: number
}

interface LogoCarouselProps {
    logos: ClientLogo[]
    speed?: number
    direction?: 'left' | 'right'
    className?: string
}

export default function LogoCarousel({
    logos,
    speed = 30,
    direction = 'left',
    className = '',
}: LogoCarouselProps) {
    const [duplicatedLogos] = useState([...logos, ...logos, ...logos])

    useEffect(() => {
        const style = document.createElement('style')
        style.innerHTML = `
            @keyframes scroll-${direction} {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(${direction === 'left' ? '-50%' : '50%'});
                }
            }
            .animate-scroll-${direction} {
                animation: scroll-${direction} ${speed}s linear infinite;
            }
            .animate-scroll-${direction}:hover {
                animation-play-state: paused;
            }
        `
        document.head.appendChild(style)
        return () => {
            document.head.removeChild(style)
        }
    }, [direction, speed])

    if (logos.length === 0) {
        return null
    }

    return (
        <div className={`w-full overflow-hidden bg-white py-12 ${className}`}>
            <div className="container mx-auto px-4 md:px-6 lg:px-8 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900">
                    Trusted by Industry Leaders
                </h2>
                <p className="text-center text-slate-600 mt-2">
                    Hundreds of transport companies rely on democompany
                </p>
            </div>
            <div className="relative">
                <div className={`flex animate-scroll-${direction}`}>
                    {duplicatedLogos.map((logo, index) => (
                        <div
                            key={`${logo.id}-${index}`}
                            className="flex-shrink-0 px-8 md:px-12 flex items-center justify-center"
                        >
                            <div className="flex items-center justify-center w-32 h-20 md:w-48 md:h-24 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 grayscale hover:grayscale-0 transition-all duration-300">
                                <img
                                    src={logo.logo}
                                    alt={logo.name}
                                    width={logo.width || 150}
                                    height={logo.height || 60}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Fade edges for smooth appearance */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
        </div>
    )
}
