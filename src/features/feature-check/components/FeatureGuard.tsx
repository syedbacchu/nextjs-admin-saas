/**
 * Feature Guard Components
 * UI components for protecting features based on user access
 */

'use client'

import React from 'react'
import { useFeatureCheck, useVehicleTier } from '../hooks/useFeatureCheck'
import type { FeatureCheckResult } from '../types'

/**
 * Basic Feature Guard
 * Shows children only if feature is available
 *
 * @example
 * <FeatureGuard featureKey="trip.monitoring">
 *   <TripDashboard />
 * </FeatureGuard>
 */
export function FeatureGuard({
  featureKey,
  fallback = null,
  defaultValue = false,
  children,
}: {
  featureKey: string
  fallback?: React.ReactNode | null
  defaultValue?: boolean
  children: React.ReactNode
}) {
  const { canUse } = useFeatureCheck()

  if (!canUse(featureKey, defaultValue)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Feature Guard with Upgrade Prompt
 * Shows upgrade prompt when feature is not available
 *
 * @example
 * <FeatureGuardWithUpgrade featureKey="fuel.intelligence">
 *   <FuelAnalytics />
 * </FeatureGuardWithUpgrade>
 */
export function FeatureGuardWithUpgrade({
  featureKey,
  fallback = null,
  defaultValue = false,
  children,
}: {
  featureKey: string
  fallback?: React.ReactNode | null
  defaultValue?: boolean
  children: React.ReactNode
}) {
  const { canUse, requestUpgrade, getFeatureStatus } = useFeatureCheck()

  if (!canUse(featureKey, defaultValue)) {
    const status = getFeatureStatus(featureKey, defaultValue)

    // Show upgrade prompt component
    return (
      <>{fallback || <UpgradePromptCard featureKey={featureKey} />}</>
    )
  }

  return <>{children}</>
}

/**
 * Upgrade Prompt Card
 * Displayed when user tries to access unavailable feature
 */
export function UpgradePromptCard({ featureKey }: { featureKey: string }) {
  const { requestUpgrade } = useFeatureCheck()

  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
        <svg
          className="h-8 w-8 text-yellow-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        Premium Feature
      </h3>

      <p className="mb-6 text-sm text-gray-600">
        This feature is not available in your current package. Upgrade to
        access this feature.
      </p>

      <button
        onClick={() => requestUpgrade(featureKey)}
        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Upgrade Package
      </button>
    </div>
  )
}

/**
 * Limited Feature Guard
 * Shows content if usage is within limits
 *
 * @example
 * <LimitedFeatureGuard
 *   featureKey="vehicle.manage_5_10"
 *   currentUsage={currentVehicleCount}
 *   limit={5}
 * >
 *   <VehicleForm />
 * </LimitedFeatureGuard>
 */
export function LimitedFeatureGuard({
  featureKey,
  currentUsage,
  children,
  limitReachedFallback = null,
}: {
  featureKey: string
  currentUsage: number
  children: React.ReactNode
  limitReachedFallback?: React.ReactNode | null
}) {
  const { checkUsageLimit, requestUpgrade } = useFeatureCheck()

  const limitCheck = checkUsageLimit(featureKey, currentUsage)

  if (!limitCheck.allowed) {
    return (
      <>
        {limitReachedFallback || (
          <LimitReachedCard
            featureKey={featureKey}
            current={currentUsage}
            limit={limitCheck.limit || 0}
          />
        )}
      </>
    )
  }

  return <>{children}</>
}

/**
 * Limit Reached Card
 * Shown when user has reached their feature limit
 */
export function LimitReachedCard({
  featureKey,
  current,
  limit,
}: {
  featureKey: string
  current: number
  limit: number
}) {
  const { requestUpgrade } = useFeatureCheck()

  return (
    <div className="rounded-lg border-2 border-dashed border-red-300 bg-red-50 p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        Limit Reached
      </h3>

      <p className="mb-2 text-sm text-gray-600">
        You have reached your limit of {limit} items for this feature.
      </p>

      <p className="mb-6 text-sm text-gray-500">
        Current: {current} / Limit: {limit}
      </p>

      <button
        onClick={() => requestUpgrade(featureKey)}
        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Upgrade Limit
      </button>
    </div>
  )
}

/**
 * Access Control Guard
 * Shows content based on CRUD permissions
 */
export function AccessControlGuard({
  featureKey,
  permission,
  fallback = null,
  children,
}: {
  featureKey: string
  permission: 'create' | 'read' | 'update' | 'delete' | 'export'
  fallback?: React.ReactNode | null
  children: React.ReactNode
}) {
  const { getAccessLevel } = useFeatureCheck()

  const access = getAccessLevel(featureKey)

  const hasPermission = {
    create: access.canCreate,
    read: access.canRead,
    update: access.canUpdate,
    delete: access.canDelete,
    export: access.canExport,
  }[permission]

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Feature Badge
 * Shows feature status badge
 */
export function FeatureBadge({
  featureKey,
  type = 'status',
}: {
  featureKey: string
  type?: 'status' | 'tier' | 'limit'
}) {
  const { getFeatureStatus, checkUsageLimit } = useFeatureCheck()

  if (type === 'status') {
    const status = getFeatureStatus(featureKey)

    if (!status.allowed) {
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
          Locked
        </span>
      )
    }

    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
        Active
      </span>
    )
  }

  if (type === 'limit') {
    // This would need current usage data
    return null
  }

  return null
}

/**
 * Multiple Feature Guard
 * Requires ALL specified features to be available
 */
export function MultiFeatureGuard({
  featureKeys,
  fallback = null,
  children,
}: {
  featureKeys: string[]
  fallback?: React.ReactNode | null
  children: React.ReactNode
}) {
  const { hasAll } = useFeatureCheck()

  if (!hasAll(featureKeys)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Any Feature Guard
 * Requires AT LEAST ONE of the specified features to be available
 */
export function AnyFeatureGuard({
  featureKeys,
  fallback = null,
  children,
}: {
  featureKeys: string[]
  fallback?: React.ReactNode | null
  children: React.ReactNode
}) {
  const { hasAny } = useFeatureCheck()

  if (!hasAny(featureKeys)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default FeatureGuard

export { VehicleLimitGuard } from './VehicleLimitGuard'
