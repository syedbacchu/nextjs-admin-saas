/**
 * Feature System Test Component
 * Use this to verify your feature system is working
 */

'use client'

import { useFeatureCheck } from '@/features/feature-check'
import { FeatureGuard } from '@/features/feature-check'

export function FeatureTestComponent() {
  const { canUse, features, isLoading } = useFeatureCheck()

  if (isLoading) {
    return <div>Loading features...</div>
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-4">Feature System Test</h2>

      {/* Show all available features */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Available Features:</h3>
        <pre className="bg-gray-100 p-2 rounded text-xs">
          {JSON.stringify(features, null, 2)}
        </pre>
      </div>

      {/* Test individual features */}
      <div className="space-y-2">
        <h3 className="font-semibold">Feature Access Test:</h3>

        <div className="flex items-center gap-2">
          <span>Trip Monitoring:</span>
          <span className={canUse('trip.monitoring') ? 'text-green-600' : 'text-red-600'}>
            {canUse('trip.monitoring') ? '✓ Available' : '✗ Locked'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>Fuel Management:</span>
          <span className={canUse('fuel.management') ? 'text-green-600' : 'text-red-600'}>
            {canUse('fuel.management') ? '✓ Available' : '✗ Locked'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>Payroll:</span>
          <span className={canUse('payroll.salary_commission') ? 'text-green-600' : 'text-red-600'}>
            {canUse('payroll.salary_commission') ? '✓ Available' : '✗ Locked'}
          </span>
        </div>
      </div>

      {/* Test FeatureGuard component */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">FeatureGuard Test:</h3>

        <FeatureGuard featureKey="trip.monitoring" fallback={<div className="text-red-600">Trip feature is locked</div>}>
          <div className="text-green-600">Trip feature is available! This should only show if you have access.</div>
        </FeatureGuard>
      </div>
    </div>
  )
}

export function FeatureGuardExample() {
  return (
    <div className="space-y-4">
      {/* Example 1: Basic protection */}
      <FeatureGuard featureKey="trip.monitoring">
        <div>This content requires trip monitoring feature</div>
      </FeatureGuard>

      {/* Example 2: With upgrade prompt */}
      <FeatureGuard
        featureKey="fuel.intelligence"
        fallback={<div className="text-gray-500">Upgrade to access fuel intelligence</div>}
      >
        <div>This content requires fuel intelligence feature</div>
      </FeatureGuard>

      {/* Example 3: Multiple features (any one required) */}
      <FeatureGuard
        featureKey="vehicle.manage_5_10"
        fallback={<div className="text-gray-500">Vehicle management required</div>}
      >
        <div>This content requires any vehicle tier</div>
      </FeatureGuard>
    </div>
  )
}
