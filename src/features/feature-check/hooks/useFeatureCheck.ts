/**
 * Feature Check Hook
 * Enterprise feature access control for React components
 */

import { useContext, useCallback, useMemo } from 'react'
import { FeatureContext } from '../contexts/FeatureContext'
import type {
  FeatureCheckResult,
  FeatureLimitCheck,
  FeatureAccessLevel,
  AccessLevel,
} from '../types'

/**
 * Main feature check hook
 *
 * @example
 * const { canUse } = useFeatureCheck()
 * if (canUse('trip.monitoring')) {
 *   // Show trip monitoring feature
 * }
 */
export function useFeatureCheck() {
  const context = useContext(FeatureContext)

  if (!context) {
    throw new Error('useFeatureCheck must be used within FeatureProvider')
  }

  /**
   * Check if a feature is available
   */
  const canUse = useCallback(
    (featureKey: string, defaultValue: any = false): boolean => {
      const result = context.checkFeature(featureKey, defaultValue)
      return result.allowed
    },
    [context.checkFeature]
  )

  /**
   * Get detailed feature check result
   */
  const getFeatureStatus = useCallback(
    (featureKey: string, defaultValue: any = false): FeatureCheckResult => {
      return context.checkFeature(featureKey, defaultValue)
    },
    [context.checkFeature]
  )

  /**
   * Check if usage is within feature limits
   */
  const checkUsageLimit = useCallback(
    (featureKey: string, currentUsage: number): FeatureLimitCheck => {
      return context.checkLimit(featureKey, currentUsage)
    },
    [context.checkLimit]
  )

  /**
   * Get access level for a feature
   */
  const getAccessLevel = useCallback(
    (featureKey: string): FeatureAccessLevel => {
      return context.getAccessLevel(featureKey)
    },
    [context.getAccessLevel]
  )

  /**
   * Show upgrade prompt for a feature
   */
  const requestUpgrade = useCallback(
    (featureKey: string) => {
      context.showUpgradePrompt(featureKey)
    },
    [context.showUpgradePrompt]
  )

  /**
   * Refresh feature data from server
   */
  const refresh = useCallback(async () => {
    await context.refreshFeatures()
  }, [context.refreshFeatures])

  /**
   * Batch feature checking for multiple features
   */
  const checkMultiple = useCallback(
    (featureKeys: string[]): Record<string, boolean> => {
      const results: Record<string, boolean> = {}
      featureKeys.forEach(key => {
        results[key] = canUse(key)
      })
      return results
    },
    [canUse]
  )

  /**
   * Get first available feature from a list
   */
  const getFirstAvailable = useCallback(
    (featureKeys: string[]): string | null => {
      const available = featureKeys.filter(key => canUse(key))
      return available.length > 0 ? available[0] : null
    },
    [canUse]
  )

  /**
   * Check if any of the given features are available
   */
  const hasAny = useCallback(
    (featureKeys: string[]): boolean => {
      return featureKeys.some(key => canUse(key))
    },
    [canUse]
  )

  /**
   * Check if all of the given features are available
   */
  const hasAll = useCallback(
    (featureKeys: string[]): boolean => {
      return featureKeys.every(key => canUse(key))
    },
    [canUse]
  )

  return {
    // Core methods
    canUse,
    getFeatureStatus,
    checkUsageLimit,
    getAccessLevel,

    // UI helpers
    requestUpgrade,
    refresh,

    // Batch operations
    checkMultiple,
    getFirstAvailable,
    hasAny,
    hasAll,

    // Context data
    features: context.features,
    isLoading: context.isLoading,
    error: context.error,
  }
}

/**
 * Simplified feature check hook for common use cases
 */
export function useFeature(featureKey: string) {
  const { canUse, getFeatureStatus, requestUpgrade } = useFeatureCheck()

  return {
    allowed: canUse(featureKey),
    status: getFeatureStatus(featureKey),
    upgrade: () => requestUpgrade(featureKey),
  }
}

/**
 * Vehicle tier check hook
 */
export function useVehicleTier() {
  const { getFirstAvailable } = useFeatureCheck()

  const tier = useMemo(() => {
    const vehicleFeatures = [
      'vehicle.manage_1_5',
      'vehicle.manage_5_10',
      'vehicle.manage_10_20',
      'vehicle.manage_20_50',
      'vehicle.manage_unlimited',
    ]

    const available = getFirstAvailable(vehicleFeatures)

    if (available === 'vehicle.manage_unlimited') return 'unlimited'
    if (available === 'vehicle.manage_20_50') return '20-50'
    if (available === 'vehicle.manage_10_20') return '10-20'
    if (available === 'vehicle.manage_5_10') return '5-10'
    if (available === 'vehicle.manage_1_5') return '1-5'

    return null
  }, [getFirstAvailable])

  const getLimit = useCallback((): number | null => {
    if (tier === '1-5') return 5
    if (tier === '5-10') return 10
    if (tier === '10-20') return 20
    if (tier === '20-50') return 50
    if (tier === 'unlimited') return null
    return null
  }, [tier])

  return {
    tier,
    limit: getLimit(),
    hasVehicles: tier !== null,
  }
}

/**
 * Staff tier check hook
 */
export function useStaffTier() {
  const { getFirstAvailable } = useFeatureCheck()

  const tier = useMemo(() => {
    const staffFeatures = [
      'staff.multi_user_access_2',
      'staff.multi_user_access_3',
      'staff.multi_user_access_5',
      'staff.multi_user_access_10',
    ]

    const available = getFirstAvailable(staffFeatures)

    if (available === 'staff.multi_user_access_10') return '10'
    if (available === 'staff.multi_user_access_5') return '5'
    if (available === 'staff.multi_user_access_3') return '3'
    if (available === 'staff.multi_user_access_2') return '2'

    return null
  }, [getFirstAvailable])

  const getLimit = useCallback((): number | null => {
    if (tier === '2') return 2
    if (tier === '3') return 3
    if (tier === '5') return 5
    if (tier === '10') return 10
    return null
  }, [tier])

  return {
    tier,
    limit: getLimit(),
    hasStaffAccess: tier !== null,
  }
}

/**
 * Access control hook for CRUD operations
 */
export function useAccessControl(featureKey: string) {
  const { getAccessLevel } = useFeatureCheck()

  const access = useMemo(() => {
    return getAccessLevel(featureKey)
  }, [getAccessLevel, featureKey])

  return {
    canView: access.canRead,
    canCreate: access.canCreate,
    canEdit: access.canUpdate,
    canDelete: access.canDelete,
    canExport: access.canExport,
    hasFullAccess: access.canRead && access.canCreate && access.canUpdate,
    hasAdvancedAccess: access.canDelete || access.canExport,
  }
}

export default useFeatureCheck
