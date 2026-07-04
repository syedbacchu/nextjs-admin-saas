'use client'

import Image from 'next/image'
import { MaintenanceServiceAlert } from '@/features/dashboard'

interface MaintenanceAlertCardProps {
    service: MaintenanceServiceAlert
}

function formatDate(value: string | null | undefined): string {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export default function MaintenanceAlertCard({ service }: MaintenanceAlertCardProps) {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = '/assets/images/vehicle.png'
    }

    return (
        <div className="rounded-xl border-2 border-cyan-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Vehicle Image */}
            <div className="relative h-48 overflow-hidden bg-slate-100">
                <Image
                    src={service.vehicle?.image || '/assets/images/vehicle.png'}
                    alt={service.vehicle?.name || 'Unknown Vehicle'}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                    unoptimized
                    onError={handleImageError}
                />
                <div className={`absolute top-3 right-3 px-3 py-1.5 text-white text-sm font-bold rounded-full shadow-lg ${
                    service.is_overdue ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                    {service.is_overdue ? 'Overdue' : 'Upcoming'}
                </div>
            </div>

            {/* Service Info */}
            <div className="p-4">
                <h3 className="font-bold text-lg text-slate-900">{service.vehicle?.name || 'Unknown Vehicle'}</h3>
                <p className="text-sm text-cyan-700 mb-1">{service.category}</p>
                <p className="text-xs text-slate-500 mb-4">{service.supplier?.name || '-'}</p>

                {/* Due Date - Main Focus */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg px-4 py-3 border border-cyan-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs text-cyan-700 font-medium uppercase tracking-wide">Next Service Date</p>
                            <p className="text-xl font-bold text-slate-900 mt-1">{formatDate(service.next_service_date)}</p>
                        </div>
                        <div className={`ml-3 px-4 py-2 rounded-lg text-sm font-bold ${
                            service.is_overdue ? 'bg-red-500 text-white' : 'bg-cyan-500 text-white'
                        }`}>
                            {service.is_overdue ? `${service.days_overdue}d overdue` : `in ${service.days_until_service}d`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
