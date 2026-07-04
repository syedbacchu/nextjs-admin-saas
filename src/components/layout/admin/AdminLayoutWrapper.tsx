'use client'

import React from 'react'
import { FeatureProvider } from '@/features/feature-check'
import type { FeatureMap } from '@/features/feature-check/types'

interface AdminLayoutWrapperProps {
  children: React.ReactNode
  tenantSlug: string
  initialFeatures?: FeatureMap
}

export default function AdminLayoutWrapper({ children, tenantSlug, initialFeatures }: AdminLayoutWrapperProps) {
  return <FeatureProvider tenantSlug={tenantSlug} initialFeatures={initialFeatures}>{children}</FeatureProvider>
}
