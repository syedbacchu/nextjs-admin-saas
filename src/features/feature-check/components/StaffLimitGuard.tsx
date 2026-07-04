/**
 * Staff Limit Guard Component
 * Handles staff management tier limits dynamically
 */

'use client'

import React from 'react'
import { useStaffTier } from '../hooks/useFeatureCheck'

interface StaffLimitGuardProps {
  currentUsage: number
  children: React.ReactNode
  limitReachedFallback?: React.ReactNode | null
}

export function StaffLimitGuard({
  currentUsage,
  children,
  limitReachedFallback = null,
}: StaffLimitGuardProps) {
  const { tier, limit, hasStaffAccess } = useStaffTier()

  if (!hasStaffAccess || !limit) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center">
      <p className="text-sm text-gray-600">
        Staff management is not available in your current package.
      </p>
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('showUpgradePrompt', { detail: { featureKey: 'staff.multi_user_access_2' } }))}
        className="mt-3 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
      >
        Upgrade to Add Staff
      </button>
    </div>
    )
  }

  if (limit !== null && currentUsage >= limit) {
    return (
      <>
        {limitReachedFallback || (
          <div className="rounded-lg border-2 border-dashed border-red-300 bg-red-50 p-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
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
            <h3 className="mb-2 text-sm font-semibold text-gray-900">
              Staff Limit Reached
            </h3>
            <p className="mb-1 text-xs text-gray-600">
              You have reached your limit of {limit} staff users.
            </p>
            <p className="mb-4 text-xs text-gray-500">
              Current: {currentUsage} / Limit: {limit}
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('showUpgradePrompt', { detail: { featureKey: 'staff.multi_user_access_2' } }))}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Upgrade Limit
            </button>
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
}

export default StaffLimitGuard
