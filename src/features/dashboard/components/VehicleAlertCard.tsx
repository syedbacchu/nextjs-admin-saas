'use client'

import Image from 'next/image'
import { VehicleWithAlerts } from '@/features/dashboard'

interface VehicleAlertCardProps {
    vehicle: VehicleWithAlerts
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

function getAlertStatusColor(status: string): string {
    switch (status) {
        case 'expired':
            return 'bg-red-500 text-white'
        case 'critical':
            return 'bg-orange-500 text-white'
        case 'warning':
            return 'bg-yellow-500 text-white'
        default:
            return 'bg-gray-500 text-white'
    }
}

export default function VehicleAlertCard({ vehicle }: VehicleAlertCardProps) {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = '/assets/images/vehicle.png'
    }

    return (
        <div className="rounded-xl border-2 border-orange-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Vehicle Image */}
            <div className="relative h-48 overflow-hidden bg-slate-100">
                <Image
                    src={vehicle.image || '/assets/images/vehicle.png'}
                    alt={vehicle.vehicle_name}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                    unoptimized
                    onError={handleImageError}
                />
                {vehicle.alerts.some(a => a.is_expired) && (
                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                        Expired
                    </div>
                )}
            </div>

            {/* Vehicle Info */}
            <div className="p-4">
                <h3 className="font-bold text-lg text-slate-900">{vehicle.vehicle_name}</h3>
                <p className="text-sm text-slate-600 mb-1">{vehicle.registration_no}</p>
                {vehicle.brand && vehicle.model && (
                    <p className="text-xs text-slate-500 mb-4">{vehicle.brand} {vehicle.model}</p>
                )}

                {/* Alerts */}
                <div className="space-y-2">
                    {vehicle.alerts.map((alert, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2 border border-orange-200"
                        >
                            <div className="flex-1">
                                <span className="font-medium text-orange-800 text-sm">{alert.type}</span>
                                <p className="text-orange-600 text-xs mt-0.5">{formatDate(alert.expiry_date)}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                                <span className={`font-bold text-sm ${
                                    alert.is_expired ? 'text-red-600' : 'text-orange-900'
                                }`}>
                                    {alert.is_expired ? `-${alert.days_overdue}d` : `+${alert.days_until_expiry}d`}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${
                                    getAlertStatusColor(alert.status)
                                }`}>
                                    {alert.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
