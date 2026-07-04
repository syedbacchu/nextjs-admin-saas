/**
 * Feature Check System Types
 * Enterprise feature access control for frontend
 */

export interface FeatureMap {
  [featureKey: string]: boolean | number | string | object
}

export interface FeatureCheckResult {
  allowed: boolean
  featureKey: string
  value?: boolean | number | string | object
  reason?: 'not_subscribed' | 'feature_disabled' | 'limit_reached' | 'allowed'
}

export interface FeatureLimitCheck {
  allowed: boolean
  current: number
  limit: number | null
  remaining: number
}

export interface FeatureAccessLevel {
  hasAccess: boolean
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
  canExport: boolean
}

export interface FeatureUpgradePrompt {
  show: boolean
  featureKey: string
  featureName: string
  currentPlan: string
  requiredPlan: string
  upgradeUrl: string
}

export interface FeatureContextType {
  features: FeatureMap | null
  isLoading: boolean
  error: string | null
  checkFeature: (featureKey: string, defaultValue?: any) => FeatureCheckResult
  checkLimit: (featureKey: string, currentUsage: number) => FeatureLimitCheck
  getAccessLevel: (featureKey: string) => FeatureAccessLevel
  showUpgradePrompt: (featureKey: string) => void
  refreshFeatures: () => Promise<void>
}

/**
 * Feature Categories for UI organization
 */
export enum FeatureCategory {
  VEHICLE = 'vehicle',
  TRIP = 'trip',
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  SUPPLIER = 'supplier',
  EMPLOYEE = 'employee',
  HR = 'hr',
  PAYROLL = 'payroll',
  FUEL = 'fuel',
  MAINTENANCE = 'maintenance',
  FINANCE = 'finance',
  REPORTS = 'reports',
  OPERATIONS = 'operations',
  COMMUNICATION = 'communication',
  WORKFLOW = 'workflow',
  SUPPORT = 'support',
  DATA = 'data',
}

/**
 * Feature access levels for permissions
 */
export enum AccessLevel {
  NONE = 'none',
  READ = 'read',
  BASIC = 'basic',      // Create, Read
  FULL = 'full',        // Create, Read, Update
  ADVANCED = 'advanced' // Create, Read, Update, Delete, Export
}

/**
 * Common feature keys with their display names
 */
export const FEATURE_DISPLAY_NAMES: Record<string, string> = {
  'vehicle.manage_1_5': '1-5 Vehicles',
  'vehicle.manage_5_10': '5-10 Vehicles',
  'vehicle.manage_10_20': '10-20 Vehicles',
  'vehicle.manage_20_50': '20-50 Vehicles',
  'vehicle.manage_unlimited': 'Unlimited Vehicles',
  'trip.monitoring': 'Trip Monitoring',
  'fuel.management': 'Fuel Management',
  'fuel.intelligence': 'Fuel Intelligence',
  'service.maintenance': 'Maintenance Tracking',
  'customer.management': 'Customer Management',
  'vendor.management': 'Vendor Management',
  'supplier.management': 'Supplier Management',
  'employee.management': 'Employee Management',
  'payroll.salary_commission': 'Payroll Management',
  'reports.advanced_analytics': 'Advanced Reports',
  'gps.api_integration': 'GPS Tracking',
}

/**
 * Feature requirement levels for upgrade prompts
 */
export const FEATURE_REQUIREMENTS: Record<string, string> = {
  'trip.monitoring': 'Premium',
  'fuel.management': 'Standard',
  'fuel.intelligence': 'Premium',
  'payroll.salary_commission': 'Premium',
  'reports.advanced_analytics': 'Enterprise',
  'gps.api_integration': 'Enterprise',
}
