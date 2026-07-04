/**
 * Feature Context Provider
 * Manages feature access state across the application
 */

'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type {
  FeatureMap,
  FeatureContextType,
  FeatureCheckResult,
  FeatureLimitCheck,
  FeatureAccessLevel,
} from '../types'

// Create context with null default
export const FeatureContext = createContext<FeatureContextType | null>(null)

/**
 * Feature Provider Component
 *
 * @example
 * <FeatureProvider tenantSlug="my-tenant" initialFeatures={featuresFromServer}>
 *   <App />
 * </FeatureProvider>
 */
export function FeatureProvider({ children, tenantSlug, initialFeatures }: { children: React.ReactNode; tenantSlug: string; initialFeatures?: FeatureMap }) {
  const [features, setFeatures] = useState<FeatureMap | null>(initialFeatures || null)
  const [isLoading, setIsLoading] = useState(!initialFeatures)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load features from subscription
   */
  const loadFeatures = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get subscription details which include features
      const response = await fetch(`/tenant/${encodeURIComponent(tenantSlug)}/account/subscription-details`)

      const data = await response.json()
      if (data.success && data.data) {
        const features = data.data.features || {}
        setFeatures(features)
      } else {
        setFeatures({})
      }
    } catch (err) {
      console.error('Failed to load features:', err)
      setError('Failed to load feature data')
      setFeatures({})
    } finally {
      setIsLoading(false)
    }
  }, [tenantSlug])

  /**
   * Load features on mount (only if we don't have initial features)
   */
  useEffect(() => {
    if (!initialFeatures) {
      loadFeatures()
    }
  }, [initialFeatures, loadFeatures])

  /**
   * Check if a feature is available
   */
  const checkFeature = useCallback(
    (featureKey: string, defaultValue: any = false): FeatureCheckResult => {
      if (!features) {
        return {
          allowed: false,
          featureKey,
          reason: 'not_subscribed',
        }
      }

      const value = features[featureKey]

      // Feature not found
      if (value === undefined || value === null) {
        return {
          allowed: defaultValue,
          featureKey,
          value: defaultValue,
          reason: defaultValue ? 'allowed' : 'feature_disabled',
        }
      }

      // Boolean feature
      if (typeof value === 'boolean') {
        return {
          allowed: value,
          featureKey,
          value,
          reason: value ? 'allowed' : 'feature_disabled',
        }
      }

      // Numeric feature (limits)
      if (typeof value === 'number') {
        return {
          allowed: value > 0,
          featureKey,
          value,
          reason: value > 0 ? 'allowed' : 'limit_reached',
        }
      }

      // String/object feature
      if (typeof value === 'string' || typeof value === 'object') {
        const hasValue = typeof value === 'string' ? value.trim() !== '' : Object.keys(value).length > 0
        return {
          allowed: hasValue,
          featureKey,
          value,
          reason: hasValue ? 'allowed' : 'feature_disabled',
        }
      }

      return {
        allowed: false,
        featureKey,
        reason: 'feature_disabled',
      }
    },
    [features]
  )

  /**
   * Check if usage is within limits
   */
  const checkLimit = useCallback(
    (featureKey: string, currentUsage: number): FeatureLimitCheck => {
      const checkResult = checkFeature(featureKey)

      // Feature not available or no limit set
      if (!checkResult.allowed || typeof checkResult.value !== 'number') {
        return {
          allowed: checkResult.allowed,
          current: currentUsage,
          limit: null,
          remaining: Infinity,
        }
      }

      const limit = checkResult.value as number
      const remaining = Math.max(0, limit - currentUsage)

      return {
        allowed: currentUsage < limit,
        current: currentUsage,
        limit,
        remaining,
      }
    },
    [checkFeature]
  )

  /**
   * Get access level for a feature
   */
  const getAccessLevel = useCallback(
    (featureKey: string): FeatureAccessLevel => {
      const checkResult = checkFeature(featureKey)

      // Basic access based on feature availability
      const hasAccess = checkResult.allowed

      return {
        hasAccess,
        canCreate: hasAccess,
        canRead: hasAccess, // Read access granted with feature
        canUpdate: hasAccess,
        canDelete: hasAccess, // For now, same access level
        canExport: hasAccess, // For now, same access level
      }
    },
    [checkFeature]
  )

  /**
   * Show upgrade prompt (integrates with modal system)
   */
  const showUpgradePrompt = useCallback((featureKey: string) => {
    // Dispatch custom event for upgrade modal
    const event = new CustomEvent('showUpgradePrompt', {
      detail: { featureKey },
    })
    window.dispatchEvent(event)

    // Or open modal directly if you have modal state
    // setUpgradeModal({ show: true, featureKey })
  }, [])

  /**
   * Refresh features from server
   */
  const refreshFeatures = useCallback(async () => {
    await loadFeatures()
  }, [loadFeatures])

  const value: FeatureContextType = {
    features,
    isLoading,
    error,
    checkFeature,
    checkLimit,
    getAccessLevel,
    showUpgradePrompt,
    refreshFeatures,
  }

  return <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>
}

/**
 * Hook to use feature context
 */
export function useFeatureContext() {
  const context = useContext(FeatureContext)
  if (!context) {
    throw new Error('useFeatureContext must be used within FeatureProvider')
  }
  return context
}

export default FeatureContext
