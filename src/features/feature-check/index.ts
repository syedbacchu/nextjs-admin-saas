/**
 * Feature Check System
 * Enterprise feature access control for SaaS platform
 *
 * @example
 * // In app.tsx or layout.tsx
 * import { FeatureProvider } from '@/features/feature-check'
 *
 * export default function App() {
 *   return (
 *     <FeatureProvider>
 *       <YourApp />
 *     </FeatureProvider>
 *   )
 * }
 *
 * @example
 * // In components
 * import { FeatureGuard } from '@/features/feature-check'
 *
 * <FeatureGuard featureKey="trip.monitoring">
 *   <TripMonitoring />
 * </FeatureGuard>
 */

// Context
export { FeatureProvider, useFeatureContext } from './contexts/FeatureContext'
export { default as FeatureContext } from './contexts/FeatureContext'

// Hooks
export {
  useFeatureCheck,
  useFeature,
  useVehicleTier,
  useStaffTier,
  useAccessControl,
} from './hooks/useFeatureCheck'

// Components
export {
  FeatureGuard,
  FeatureGuardWithUpgrade,
  UpgradePromptCard,
  LimitedFeatureGuard,
  LimitReachedCard,
  AccessControlGuard,
  FeatureBadge,
  MultiFeatureGuard,
  AnyFeatureGuard,
  VehicleLimitGuard,
} from './components/FeatureGuard'
export { default as StaffLimitGuard } from './components/StaffLimitGuard'

// Types
export type {
  FeatureMap,
  FeatureCheckResult,
  FeatureLimitCheck,
  FeatureAccessLevel,
  FeatureUpgradePrompt,
  FeatureContextType,
} from './types'

export {
  FeatureCategory,
  AccessLevel,
  FEATURE_DISPLAY_NAMES,
  FEATURE_REQUIREMENTS,
} from './types'

// Utilities
export { FeatureUtils } from './utils/featureUtils'
