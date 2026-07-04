/**
 * Feature Utilities
 * Helper functions for feature management and checking
 */

import type {
  FeatureMap,
  FeatureCategory,
  AccessLevel,
} from '../types'
import { FEATURE_DISPLAY_NAMES, FEATURE_REQUIREMENTS } from '../types'

export class FeatureUtils {
  /**
   * Get display name for a feature key
   */
  static getDisplayName(featureKey: string): string {
    return FEATURE_DISPLAY_NAMES[featureKey] || featureKey
  }

  /**
   * Get required plan for a feature
   */
  static getRequiredPlan(featureKey: string): string {
    return FEATURE_REQUIREMENTS[featureKey] || 'Premium'
  }

  /**
   * Extract category from feature key
   */
  static getCategory(featureKey: string): FeatureCategory | null {
    const [category] = featureKey.split('.')
    return category as FeatureCategory || null
  }

  /**
   * Group features by category
   */
  static groupByCategory(features: FeatureMap): Record<string, FeatureMap> {
    const grouped: Record<string, FeatureMap> = {}

    Object.entries(features).forEach(([key, value]) => {
      const category = this.getCategory(key) || 'other'

      if (!grouped[category]) {
        grouped[category] = {}
      }

      grouped[category][key] = value
    })

    return grouped
  }

  /**
   * Get active vehicle tier from features
   */
  static getVehicleTier(features: FeatureMap): string | null {
    const vehicleFeatures = {
      'vehicle.manage_unlimited': 'unlimited',
      'vehicle.manage_20_50': '20-50',
      'vehicle.manage_10_20': '10-20',
      'vehicle.manage_5_10': '5-10',
      'vehicle.manage_1_5': '1-5',
    }

    for (const [featureKey, tier] of Object.entries(vehicleFeatures)) {
      if (features[featureKey]) {
        return tier
      }
    }

    return null
  }

  /**
   * Get active staff tier from features
   */
  static getStaffTier(features: FeatureMap): string | null {
    const staffFeatures = {
      'staff.multi_user_access_10': '10',
      'staff.multi_user_access_5': '5',
      'staff.multi_user_access_3': '3',
      'staff.multi_user_access_2': '2',
    }

    for (const [featureKey, tier] of Object.entries(staffFeatures)) {
      if (features[featureKey]) {
        return tier
      }
    }

    return null
  }

  /**
   * Get vehicle limit from tier
   */
  static getVehicleLimit(tier: string | null): number | null {
    const limits: Record<string, number> = {
      '1-5': 5,
      '5-10': 10,
      '10-20': 20,
      '20-50': 50,
      'unlimited': null,
    }

    return tier ? limits[tier] || null : null
  }

  /**
   * Get staff limit from tier
   */
  static getStaffLimit(tier: string | null): number | null {
    const limits: Record<string, number> = {
      '2': 2,
      '3': 3,
      '5': 5,
      '10': 10,
    }

    return tier ? limits[tier] || null : null
  }

  /**
   * Check if vehicle limit is reached
   */
  static isVehicleLimitReached(features: FeatureMap, currentCount: number): boolean {
    const tier = this.getVehicleTier(features)
    const limit = this.getVehicleLimit(tier)

    if (limit === null) {
      return false // Unlimited
    }

    return currentCount >= limit
  }

  /**
   * Check if staff limit is reached
   */
  static isStaffLimitReached(features: FeatureMap, currentCount: number): boolean {
    const tier = this.getStaffTier(features)
    const limit = this.getStaffLimit(tier)

    if (limit === null) {
      return true // No staff feature enabled
    }

    return currentCount >= limit
  }

  /**
   * Format feature value for display
   */
  static formatFeatureValue(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'Active' : 'Inactive'
    }

    if (typeof value === 'number') {
      return value.toString()
    }

    if (typeof value === 'string') {
      return value
    }

    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value)
    }

    return 'N/A'
  }

  /**
   * Get feature description
   */
  static getFeatureDescription(featureKey: string): string {
    const descriptions: Record<string, string> = {
      'vehicle.manage_1_5': 'Manage up to 5 vehicles',
      'vehicle.manage_5_10': 'Manage up to 10 vehicles',
      'vehicle.manage_10_20': 'Manage up to 20 vehicles',
      'vehicle.manage_20_50': 'Manage up to 50 vehicles',
      'vehicle.manage_unlimited': 'Manage unlimited vehicles',
      'staff.multi_user_access_2': 'Multi-user access for up to 2 staff',
      'staff.multi_user_access_3': 'Multi-user access for up to 3 staff',
      'staff.multi_user_access_5': 'Multi-user access for up to 5 staff',
      'staff.multi_user_access_10': 'Multi-user access for up to 10 staff',
      'trip.monitoring': 'Track trips, expenses, and payments',
      'fuel.management': 'Manage fuel purchases and consumption',
      'fuel.intelligence': 'Advanced fuel analytics and insights',
      'service.maintenance': 'Track vehicle servicing and maintenance',
      'customer.management': 'Manage customer information',
      'vendor.management': 'Manage vendor relationships',
      'supplier.management': 'Manage supplier information',
      'employee.management': 'Manage employee records',
      'payroll.salary_commission': 'Process payroll and commissions',
      'reports.advanced_analytics': 'Access advanced business reports',
      'gps.api_integration': 'GPS tracking integration',
    }

    return descriptions[featureKey] || 'Feature access control'
  }

  /**
   * Validate feature key format
   */
  static isValidFeatureKey(featureKey: string): boolean {
    // Feature keys should be: category.feature_name or category.subcategory.feature_name
    const parts = featureKey.split('.')
    return parts.length >= 2 && parts.length <= 3
  }

  /**
   * Parse feature key
   */
  static parseFeatureKey(featureKey: string): {
    category: string
    subcategory?: string
    name: string
  } | null {
    if (!this.isValidFeatureKey(featureKey)) {
      return null
    }

    const parts = featureKey.split('.')

    if (parts.length === 2) {
      return {
        category: parts[0],
        name: parts[1],
      }
    }

    if (parts.length === 3) {
      return {
        category: parts[0],
        subcategory: parts[1],
        name: parts[2],
      }
    }

    return null
  }

  /**
   * Get all features in a category
   */
  static getFeaturesInCategory(features: FeatureMap, category: string): FeatureMap {
    const categoryFeatures: FeatureMap = {}

    Object.entries(features).forEach(([key, value]) => {
      if (key.startsWith(`${category}.`)) {
        categoryFeatures[key] = value
      }
    })

    return categoryFeatures
  }

  /**
   * Count active features by category
   */
  static countActiveFeatures(features: FeatureMap): Record<string, number> {
    const grouped = this.groupByCategory(features)

    return Object.entries(grouped).reduce(
      (counts, [category, categoryFeatures]) => {
        const activeCount = Object.values(categoryFeatures).filter(
          value => {
            if (typeof value === 'boolean') return value
            if (typeof value === 'number') return value > 0
            if (typeof value === 'string') return value.trim() !== ''
            if (typeof value === 'object') return Object.keys(value).length > 0
            return false
          }
        ).length

        counts[category] = activeCount
        return counts
      },
      {} as Record<string, number>
    )
  }

  /**
   * Generate feature list for display
   */
  static generateFeatureList(features: FeatureMap): Array<{
    key: string
    name: string
    description: string
    active: boolean
    value: any
    category: string
  }> {
    return Object.entries(features).map(([key, value]) => ({
      key,
      name: this.getDisplayName(key),
      description: this.getFeatureDescription(key),
      active: this.isFeatureActive(value),
      value,
      category: this.getCategory(key) || 'other',
    }))
  }

  /**
   * Check if feature value is active
   */
  static isFeatureActive(value: any): boolean {
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value > 0
    if (typeof value === 'string') return value.trim() !== ''
    if (typeof value === 'object') return Object.keys(value).length > 0
    return false
  }

  /**
   * Get upgrade path for feature
   */
  static getUpgradePath(featureKey: string): string {
    const plan = this.getRequiredPlan(featureKey)
    return `/subscription/upgrade?feature=${featureKey}&plan=${plan.toLowerCase()}`
  }

  /**
   * Generate comparison matrix for features
   */
  static generateComparisonMatrix(
    features: FeatureMap,
    plans: string[]
  ): Record<string, Record<string, boolean>> {
    // This would require more complex logic with plan data
    // Simplified version for now
    return {}
  }
}

/**
 * Convert feature map to URL search params
 */
export function featuresToSearchParams(features: FeatureMap): string {
  const activeFeatures = Object.entries(features)
    .filter(([_, value]) => FeatureUtils.isFeatureActive(value))
    .map(([key]) => key)
    .join(',')

  return new URLSearchParams({
    features: activeFeatures,
  }).toString()
}

/**
 * Parse search params to feature requirements
 */
export function searchParamsToFeatures(searchParams: string): string[] {
  const params = new URLSearchParams(searchParams)
  const features = params.get('features')

  return features ? features.split(',') : []
}

/**
 * Calculate feature usage percentage
 */
export function calculateUsagePercentage(current: number, limit: number | null): number {
  if (limit === null) return 0 // Unlimited
  if (limit === 0) return 100 // No limit but also no capacity

  return Math.min(100, Math.round((current / limit) * 100))
}

/**
 * Get usage status color
 */
export function getUsageStatusColor(percentage: number): string {
  if (percentage >= 90) return 'red'
  if (percentage >= 70) return 'yellow'
  return 'green'
}

/**
 * Format limit display
 */
export function formatLimitDisplay(current: number, limit: number | null): string {
  if (limit === null) return `${current} / Unlimited`
  return `${current} / ${limit}`
}

export default FeatureUtils
