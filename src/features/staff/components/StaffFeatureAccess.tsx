'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { updateStaffFeaturesClient, getStaffFeaturesAction, StaffFeaturesData } from '@/features/staff'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface StaffFeatureAccessProps {
    tenantSlug: string
    staffId: number | string
    staffName: string
    onClose: () => void
}

const formatFeatureKey = (key: string): string => {
    return key
        .replace(/\./g, ' • ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function StaffFeatureAccess({ tenantSlug, staffId, staffName, onClose }: StaffFeatureAccessProps) {
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [data, setData] = useState<StaffFeaturesData | null>(null)
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
    const { language } = useI18n()

    useEffect(() => {
        loadStaffFeatures()
    }, [staffId])

    async function loadStaffFeatures() {
        setLoading(true)
        try {
            const res = await getStaffFeaturesAction(tenantSlug, staffId)
            if (res.success && res.data) {
                setData(res.data)
                // Get currently selected features (where is_accessible is true)
                const currentFeatures = Object.entries(res.data.staff_assignments || {})
                    .filter(([_, accessible]) => accessible)
                    .map(([key]) => key)
                setSelectedFeatures(currentFeatures)
            } else {
                toast.error(res.message || 'Failed to load staff features')
            }
        } catch (error) {
            toast.error('Failed to load staff features')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSave() {
        setSaving(true)
        try {
            const res = await updateStaffFeaturesClient(tenantSlug, staffId, selectedFeatures)
            if (res.success) {
                toast.success(res.message || 'Staff features updated successfully')
                onClose()
            } else {
                toast.error(res.message || 'Failed to update staff features')
            }
        } catch (error) {
            toast.error('Failed to update staff features')
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    function handleFeatureToggle(featureKey: string) {
        setSelectedFeatures(prev =>
            prev.includes(featureKey)
                ? prev.filter(key => key !== featureKey)
                : [...prev, featureKey]
        )
    }

    function handleSelectAll() {
        if (data?.tenant_features) {
            const allFeatures = Object.keys(data.tenant_features).filter(key => {
                const value = data.tenant_features[key]
                return value === true || (typeof value === 'number' && value > 0)
            })
            setSelectedFeatures(allFeatures)
        }
    }

    function handleDeselectAll() {
        setSelectedFeatures([])
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 mx-auto"></div>
                    <p className="text-sm text-slate-600">Loading features...</p>
                </div>
            </div>
        )
    }

    if (!data?.tenant_features) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
                Failed to load features data.
            </div>
        )
    }

    const tenantFeatures = Object.entries(data.tenant_features).sort(([a], [b]) => a.localeCompare(b))
    const availableFeatures = tenantFeatures.filter(([_, value]) => value === true || (typeof value === 'number' && value > 0))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Manage Feature Access</h3>
                    <p className="mt-1 text-sm text-slate-600">
                        Configure feature access for <span className="font-medium">{staffName}</span>
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    Close
                </button>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={handleSelectAll}
                    disabled={saving}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                    Select All
                </button>
                <button
                    onClick={handleDeselectAll}
                    disabled={saving}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                    Deselect All
                </button>
            </div>

            <div className="max-h-96 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-4">
                {availableFeatures.length === 0 ? (
                    <p className="text-center text-sm text-slate-600">No features available in current subscription</p>
                ) : (
                    availableFeatures.map(([key, _]) => (
                        <div key={key} className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id={`feature-${key}`}
                                checked={selectedFeatures.includes(key)}
                                onChange={() => handleFeatureToggle(key)}
                                disabled={saving}
                                className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                            />
                            <label
                                htmlFor={`feature-${key}`}
                                className={`text-sm cursor-pointer ${
                                    selectedFeatures.includes(key)
                                        ? 'font-medium text-slate-900'
                                        : 'text-slate-600'
                                }`}
                            >
                                {formatFeatureKey(key)}
                            </label>
                        </div>
                    ))
                )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600">
                    {selectedFeatures.length} feature(s) selected
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}