import { useState, useEffect } from 'react'
import { getVehiclesAction } from '@/features/vehicles'

export function useVehicleCount(tenantSlug: string): number {
    const [count, setCount] = useState(0)

    useEffect(() => {
        async function fetchCount() {
            if (!tenantSlug) {
                setCount(0)
                return
            }

            try {
                const result = await getVehiclesAction(tenantSlug, 1, '')
                if (result.success && result.data) {
                    setCount(result.data.total_count || 0)
                }
            } catch (error) {
                console.error('Failed to fetch vehicle count:', error)
                setCount(0)
            }
        }

        fetchCount()
    }, [tenantSlug])

    return count
}
