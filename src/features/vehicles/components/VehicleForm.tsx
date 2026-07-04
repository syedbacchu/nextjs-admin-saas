'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createVehicleClient, updateVehicleClient } from '@/features/vehicles'
import type {
    Vehicle,
    VehicleCategorySummary,
    VehiclePersonSummary,
    VehiclePayload,
    VehicleRegistrationSummary,
} from '@/features/vehicles'
import type { FileSystemItem } from '@/features/files'
import ImagePickerField from '@/components/form/ImagePickerField'
import MultiSelectInput from '@/components/form/MultiSelectInput'
import TextInput from '@/components/form/TextInput'
import SearchableSelect from '@/components/form/SearchableSelect'
import SelectInput from '@/components/form/SelectInput'
import { DateInput } from '@/components/form/DateInput'
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface VehicleFormProps {
    tenantSlug: string
    drivers: VehiclePersonSummary[]
    helpers: VehiclePersonSummary[]
    supervisors: VehiclePersonSummary[]
    vehicleCategories: VehicleCategorySummary[]
    registrationSerials: VehicleRegistrationSummary[]
    registrationZones: VehicleRegistrationSummary[]
    initialFiles: FileSystemItem[]
    initialData?: Partial<Vehicle>
    vehicleId?: number | string
    submitLabel?: string
}

const STATUS_OPTIONS = [
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
]

function toDateInputValue(value?: string | null): string {
    if (!value) return ''
    const trimmed = value.trim()
    if (!trimmed) return ''

    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        return trimmed.slice(0, 10)
    }

    const parsed = new Date(trimmed)
    if (Number.isNaN(parsed.getTime())) return ''
    return parsed.toISOString().slice(0, 10)
}

function getTodayDateInputValue(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function normalizeInputValue(value?: string | number | null): string {
    if (value === null || typeof value === 'undefined') return ''
    return String(value)
}

function normalizeSelectedIds(
    selected?: Array<string | number> | null,
    legacyValue?: string | number | null,
): string[] {
    if (Array.isArray(selected)) return selected.map((item) => String(item))
    if (legacyValue === null || typeof legacyValue === 'undefined') return []
    const value = String(legacyValue).trim()
    return value ? [value] : []
}

function mergeSelectedOptions(
    baseOptions: Array<{ label: string; value: string }>,
    selectedIds: string[],
    selectedItems?: VehiclePersonSummary[] | null,
    fallbackItem?: VehiclePersonSummary | null,
) {
    const optionMap = new Map(baseOptions.map((option) => [option.value, option]))
    const selectedItemList = [
        ...(selectedItems || []),
        ...(fallbackItem ? [fallbackItem] : []),
    ]

    selectedItemList.forEach((item) => {
        const value = String(item.id)
        if (!optionMap.has(value)) {
            optionMap.set(value, {
                label: `${item.name}${item.mobile ? ` (${item.mobile})` : ''}`,
                value,
            })
        }
    })

    selectedIds.forEach((id) => {
        if (!optionMap.has(id)) {
            optionMap.set(id, { label: id, value: id })
        }
    })

    return Array.from(optionMap.values())
}

export default function VehicleForm({
    tenantSlug,
    drivers,
    helpers,
    supervisors,
    vehicleCategories,
    registrationSerials,
    registrationZones,
    initialFiles,
    initialData,
    vehicleId,
    submitLabel = 'Save Vehicle',
}: VehicleFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { language } = useI18n()
    const resolvedSubmitLabel = translateUiText(submitLabel, language)
    const driverOptions = drivers.map((driver) => ({
        label: `${driver.name}${driver.mobile ? ` (${driver.mobile})` : ''}`,
        value: String(driver.id),
    }))
    const helperOptions = helpers.map((helper) => ({
        label: `${helper.name}${helper.mobile ? ` (${helper.mobile})` : ''}`,
        value: String(helper.id),
    }))
    const supervisorOptions = supervisors.map((supervisor) => ({
        label: `${supervisor.name}${supervisor.mobile ? ` (${supervisor.mobile})` : ''}`,
        value: String(supervisor.id),
    }))
    const mergedDriverOptions = mergeSelectedOptions(
        driverOptions,
        normalizeSelectedIds(initialData?.driver_ids, initialData?.driver_id),
        initialData?.drivers,
        initialData?.driver || null,
    )
    const mergedHelperOptions = mergeSelectedOptions(
        helperOptions,
        normalizeSelectedIds(initialData?.helper_ids, initialData?.helper_id),
        initialData?.helpers,
        initialData?.helper || null,
    )
    const mergedSupervisorOptions = mergeSelectedOptions(
        supervisorOptions,
        normalizeSelectedIds(initialData?.supervisor_ids),
        initialData?.supervisors,
    )
    const vehicleCategoryOptions = vehicleCategories.map((category) => ({
        label: category.name,
        value: String(category.id),
    }))

    const [registrationNo, setRegistrationNo] = useState(normalizeInputValue(initialData?.registration_no))
    const initialDate = toDateInputValue(initialData?.date)
    const isEditMode = typeof vehicleId !== 'undefined' && vehicleId !== null && String(vehicleId).trim() !== ''
    const [date, setDate] = useState(initialDate || (isEditMode ? '' : getTodayDateInputValue()))
    const [vehicleName, setVehicleName] = useState(normalizeInputValue(initialData?.vehicle_name))
    const [driverIds, setDriverIds] = useState(normalizeSelectedIds(initialData?.driver_ids, initialData?.driver_id))
    const [helperIds, setHelperIds] = useState(normalizeSelectedIds(initialData?.helper_ids, initialData?.helper_id))
    const [supervisorIds, setSupervisorIds] = useState(normalizeSelectedIds(initialData?.supervisor_ids))
    const initialVehicleCategoryId =
        typeof initialData?.vehicle_category_id === 'number' || typeof initialData?.vehicle_category_id === 'string'
            ? String(initialData.vehicle_category_id)
            : ''
    const [vehicleCategoryId, setVehicleCategoryId] = useState(initialVehicleCategoryId)
    const [vehicleSizeId, setVehicleSizeId] = useState(
        typeof initialData?.vehicle_size_id === 'number' || typeof initialData?.vehicle_size_id === 'string'
            ? String(initialData.vehicle_size_id)
            : '',
    )
    const [vehicleKpl, setVehicleKpl] = useState(
        initialData?.vehicle_kpl === null || typeof initialData?.vehicle_kpl === 'undefined'
            ? ''
            : String(initialData.vehicle_kpl),
    )
    const [fuelCapacity, setFuelCapacity] = useState(normalizeInputValue(initialData?.fuel_capacity))
    const [registrationSerialId, setRegistrationSerialId] = useState(
        typeof initialData?.registration_serial_id === 'number' || typeof initialData?.registration_serial_id === 'string'
            ? String(initialData.registration_serial_id)
            : typeof initialData?.registration_serial?.id === 'number'
                ? String(initialData.registration_serial.id)
            : '',
    )
    const [registrationZoneId, setRegistrationZoneId] = useState(
        typeof initialData?.registration_zone_id === 'number' || typeof initialData?.registration_zone_id === 'string'
            ? String(initialData.registration_zone_id)
            : typeof initialData?.registration_zone?.id === 'number'
                ? String(initialData.registration_zone.id)
            : '',
    )
    const registrationSerialOptions = registrationSerials.map((serial) => ({
        label: serial.name,
        value: String(serial.id),
    }))
    const registrationZoneOptions = registrationZones.map((zone) => ({
        label: zone.name,
        value: String(zone.id),
    }))
    const hasRegistrationSerialOption = registrationSerialOptions.some((option) => option.value === registrationSerialId)
    const hasRegistrationZoneOption = registrationZoneOptions.some((option) => option.value === registrationZoneId)
    const mergedRegistrationSerialOptions = !registrationSerialId || hasRegistrationSerialOption
        ? registrationSerialOptions
        : [
            {
                label: initialData?.registration_serial?.name || registrationSerialId,
                value: registrationSerialId,
            },
            ...registrationSerialOptions,
        ]
    const mergedRegistrationZoneOptions = !registrationZoneId || hasRegistrationZoneOption
        ? registrationZoneOptions
        : [
            {
                label: initialData?.registration_zone?.name || registrationZoneId,
                value: registrationZoneId,
            },
            ...registrationZoneOptions,
        ]
    const [registrationExpiredDate, setRegistrationExpiredDate] = useState(
        toDateInputValue(initialData?.registration_expired_date),
    )
    const [taxExpiredDate, setTaxExpiredDate] = useState(toDateInputValue(initialData?.tax_expired_date))
    const [roadPermitExpiredDate, setRoadPermitExpiredDate] = useState(
        toDateInputValue(initialData?.road_permit_expired_date),
    )
    const [fitnessExpiredDate, setFitnessExpiredDate] = useState(
        toDateInputValue(initialData?.fitness_expired_date),
    )
    const [insuranceExpiredDate, setInsuranceExpiredDate] = useState(
        toDateInputValue(initialData?.insurance_expired_date),
    )
    const [image, setImage] = useState(normalizeInputValue(initialData?.image))
    const [brand, setBrand] = useState(normalizeInputValue(initialData?.brand))
    const [model, setModel] = useState(normalizeInputValue(initialData?.model))
    const [manufacturingYear, setManufacturingYear] = useState(
        initialData?.manufacturing_year ? String(initialData.manufacturing_year) : '',
    )
    const [color, setColor] = useState(normalizeInputValue(initialData?.color))
    const [notes, setNotes] = useState(normalizeInputValue(initialData?.notes))
    const [status, setStatus] = useState(initialData?.status === 0 ? '0' : '1')
    const selectedCategory = vehicleCategories.find((item) => String(item.id) === vehicleCategoryId)
    const dynamicVehicleSizeOptions = (selectedCategory?.sizes || []).map((size) => ({
        label: size.name,
        value: String(size.id),
    }))
    const fallbackVehicleSizeOptions =
        vehicleCategoryId === initialVehicleCategoryId &&
        (typeof initialData?.vehicle_size_id === 'number' || typeof initialData?.vehicle_size_id === 'string')
            ? [{
                label: initialData?.vehicle_size?.name || String(initialData.vehicle_size_id),
                value: String(initialData.vehicle_size_id),
            }]
            : []
    const vehicleSizeOptions = dynamicVehicleSizeOptions.length > 0 ? dynamicVehicleSizeOptions : fallbackVehicleSizeOptions

    function handleVehicleCategoryChange(nextCategoryId: string) {
        setVehicleCategoryId(nextCategoryId)

        const nextCategory = vehicleCategories.find((item) => String(item.id) === nextCategoryId)
        const hasSelectedSize = (nextCategory?.sizes || []).some((size) => String(size.id) === vehicleSizeId)
        if (!hasSelectedSize) setVehicleSizeId('')
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!registrationNo.trim()) {
            toast.error(translateUiText('Registration number is required', language))
            return
        }

        if (!date.trim()) {
            toast.error(translateUiText('Date is required', language))
            return
        }

        if (!vehicleName.trim()) {
            toast.error(translateUiText('Vehicle name is required', language))
            return
        }

        if (driverIds.length === 0) {
            toast.error(translateUiText('Driver is required', language))
            return
        }

        if (!vehicleCategoryId.trim()) {
            toast.error(translateUiText('Vehicle category is required', language))
            return
        }

        if (!vehicleSizeId.trim()) {
            toast.error(translateUiText('Vehicle size is required', language))
            return
        }

        if (!vehicleKpl.trim()) {
            toast.error(translateUiText('Vehicle KPL is required', language))
            return
        }

        if (!brand.trim()) {
            toast.error(translateUiText('Brand is required', language))
            return
        }

        if (!model.trim()) {
            toast.error(translateUiText('Model is required', language))
            return
        }

        if (!manufacturingYear.trim()) {
            toast.error(translateUiText('Manufacturing year is required', language))
            return
        }

        setLoading(true)
        try {
            const payload: VehiclePayload = {
                registration_no: registrationNo.trim(),
                date: date.trim(),
                vehicle_name: vehicleName.trim(),
                driver_ids: driverIds.map((id) => Number(id)),
                helper_ids: helperIds.length > 0 ? helperIds.map((id) => Number(id)) : undefined,
                supervisor_ids: supervisorIds.map((id) => Number(id)),
                vehicle_category_id: vehicleCategoryId,
                vehicle_size_id: vehicleSizeId,
                vehicle_kpl: vehicleKpl.trim(),
                fuel_capacity: normalizeInputValue(fuelCapacity).trim(),
                registration_serial_id: registrationSerialId.trim() || undefined,
                registration_zone_id: registrationZoneId.trim() || undefined,
                registration_expired_date: registrationExpiredDate.trim() || undefined,
                tax_expired_date: taxExpiredDate.trim() || undefined,
                road_permit_expired_date: roadPermitExpiredDate.trim() || undefined,
                fitness_expired_date: fitnessExpiredDate.trim() || undefined,
                insurance_expired_date: insuranceExpiredDate.trim() || undefined,
                brand: brand.trim(),
                model: model.trim(),
                manufacturing_year: manufacturingYear.trim(),
                color: color.trim(),
                notes: notes.trim(),
                image: image.trim() || null,
                status,
            }

            const res = vehicleId
                ? await updateVehicleClient(tenantSlug, vehicleId, payload)
                : await createVehicleClient(tenantSlug, payload)

            if (res.success) {
                toast.success(res.message || translateUiText('Vehicle saved successfully', language))
                router.push(`/${tenantSlug}/vehicles`)
                router.refresh()
            } else {
                toast.error(res.message || translateUiText('Failed to save vehicle', language))
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-xl font-bold text-slate-900">{resolvedSubmitLabel}</h2>
                <p className="mt-1 text-sm text-slate-600">{translateUiText('Fill in vehicle details and save.', language)}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <DateInput
                    label="Date"
                    name="date"
                    value={date}
                    onChange={setDate}
                    required
                />
                <TextInput
                    label="Vehicle Name"
                    name="vehicle_name"
                    value={vehicleName}
                    onChange={setVehicleName}
                    placeholder="Vehicle Name"
                    required
                />
                <TextInput
                    label="Registration No"
                    name="registration_no"
                    value={registrationNo}
                    onChange={setRegistrationNo}
                    placeholder="Registration No"
                    required
                />
                <MultiSelectInput
                    label="Drivers"
                    name="driver_ids"
                    value={driverIds}
                    options={mergedDriverOptions}
                    onChange={setDriverIds}
                    required
                />
                <MultiSelectInput
                    label="Helpers"
                    name="helper_ids"
                    value={helperIds}
                    options={mergedHelperOptions}
                    onChange={setHelperIds}
                />
                <MultiSelectInput
                    label="Supervisors"
                    name="supervisor_ids"
                    value={supervisorIds}
                    options={mergedSupervisorOptions}
                    onChange={setSupervisorIds}
                />
                <SearchableSelect
                    label="Vehicle Category"
                    name="vehicle_category_id"
                    value={vehicleCategoryId}
                    options={vehicleCategoryOptions}
                    onChange={(v) => handleVehicleCategoryChange(String(v))}
                    placeholder="Select Vehicle Category"
                    required
                />
                <SelectInput
                    label="Vehicle Size"
                    name="vehicle_size_id"
                    value={vehicleSizeId}
                    options={vehicleSizeOptions}
                    onChange={setVehicleSizeId}
                    emptyOptionLabel="Select Vehicle Size"
                    required
                />
                <TextInput
                    label="Vehicle KPL"
                    name="vehicle_kpl"
                    value={vehicleKpl}
                    onChange={setVehicleKpl}
                    placeholder="Vehicle KPL"
                    type="number"
                    required
                />
                <TextInput
                    label="Fuel Capacity"
                    name="fuel_capacity"
                    value={fuelCapacity}
                    onChange={setFuelCapacity}
                    placeholder="Fuel Capacity"
                />
                <SearchableSelect
                    label="Registration Serial"
                    name="registration_serial_id"
                    value={registrationSerialId}
                    options={mergedRegistrationSerialOptions}
                    onChange={(v) => setRegistrationSerialId(String(v))}
                    placeholder="Select Registration Serial"
                />
                <SearchableSelect
                    label="Registration Zone"
                    name="registration_zone_id"
                    value={registrationZoneId}
                    options={mergedRegistrationZoneOptions}
                    onChange={(v) => setRegistrationZoneId(String(v))}
                    placeholder="Select Registration Zone"
                />
                <DateInput
                    label="Registration Expired Date"
                    name="registration_expired_date"
                    value={registrationExpiredDate}
                    onChange={setRegistrationExpiredDate}
                />
                <DateInput
                    label="Tax Expired Date"
                    name="tax_expired_date"
                    value={taxExpiredDate}
                    onChange={setTaxExpiredDate}
                />
                <DateInput
                    label="Road Permit Expired Date"
                    name="road_permit_expired_date"
                    value={roadPermitExpiredDate}
                    onChange={setRoadPermitExpiredDate}
                />
                <DateInput
                    label="Fitness Expired Date"
                    name="fitness_expired_date"
                    value={fitnessExpiredDate}
                    onChange={setFitnessExpiredDate}
                />
                <DateInput
                    label="Insurance Expired Date"
                    name="insurance_expired_date"
                    value={insuranceExpiredDate}
                    onChange={setInsuranceExpiredDate}
                />
                <TextInput
                    label="Brand"
                    name="brand"
                    value={brand}
                    onChange={setBrand}
                    placeholder="Brand"
                    required
                />
                <TextInput
                    label="Model"
                    name="model"
                    value={model}
                    onChange={setModel}
                    placeholder="Model"
                    required
                />
                <TextInput
                    label="Manufacturing Year"
                    name="manufacturing_year"
                    value={manufacturingYear}
                    onChange={setManufacturingYear}
                    placeholder="Manufacturing Year"
                    allowOnlyNumber
                    maxLength={4}
                    required
                />
                <TextInput
                    label="Color"
                    name="color"
                    value={color}
                    onChange={setColor}
                    placeholder="Color"
                />
                <SelectInput
                    label="Status"
                    name="status"
                    value={status}
                    options={STATUS_OPTIONS}
                    onChange={setStatus}
                    includeEmptyOption={false}
                />
                <TextInput
                    label="Notes"
                    name="notes"
                    value={notes}
                    onChange={setNotes}
                    placeholder="Notes"
                    textarea
                    rows={2}
                />
                <ImagePickerField
                    tenantSlug={tenantSlug}
                    label="Vehicle Image"
                    value={image}
                    onChange={setImage}
                    initialFiles={initialFiles}
                    previewAlt="Vehicle image preview"
                    triggerLabel="Choose Image"
                />
            </div>





            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                >
                    {loading ? translateUiText('Saving...', language) : resolvedSubmitLabel}
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${tenantSlug}/vehicles`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
