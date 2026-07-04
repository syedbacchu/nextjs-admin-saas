'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DateInput } from '@/components/form/DateInput'
import AreaSearchSelect from '@/components/form/AreaSearchSelect'
import SearchableSelect from '@/components/form/SearchableSelect'
import TextInput from '@/components/form/TextInput'
import { getCustomerAction } from '@/features/customers/actions/customer.actions'
import { createCustomerClient, addCustomerAddressClient } from '@/features/customers/actions/customer.client'
import { createTripClient, updateTripClient, getNextChallanNoAction, getLastOdometerReadingAction, Trip } from '@/features/trip'
import type { Customer, CustomerAddressItem } from '@/features/customers/types'
import type { Vendor } from '@/features/vendors'
import type { Vehicle } from '@/features/vehicles'
import { getVehicleAction } from '@/features/vehicles'
import {createOfficeClient, Office} from "@/features/offices";
import {
    calculateRouteDistanceByGoogleMapsAction,
    getRouteDistanceAction,
    RoutePricingArea,
    RoutePricingVehicleCategory
} from "@/features/route-pricings";
import {getRentVehicleAction, RentVehicle} from "@/features/rent-vehicles";
import {createSupplierClient, Supplier} from "@/features/suppliers";
import {createAreaClient, getAreasClient} from "@/features/area";

interface TripFormProps {
    tenantSlug: string
    customers: Customer[]
    offices: Office[]
    unloadAreas: RoutePricingArea[]
    vendors: Vendor[]
    vehicles: Vehicle[]
    rentVehicles: RentVehicle[]
    vehicleCategories: RoutePricingVehicleCategory[]
    suppliers: Supplier[]
    initialData?: Partial<Trip>
    tripId?: number | string
    submitLabel?: string
}

type TripFormState = {
    date: string
    customer_id: string
    office_id: string
    load_area_id: string
    unload_area_id: string
    trip_type: string
    additional_unload_point: string
    sender_name: string
    product_details: string
    transport_type: string
    vendor_id: string
    vehicle_id: string
    rent_vehicle_id: string
    vehicle_no: string
    driver_name: string
    driver_id: string
    helper_id: string
    supervisor_id: string
    vehicle_category_id: string
    vehicle_size_id: string
    challan_no: string
    total_rent_bill_amount: string
    odometer_start_km: string
    odometer_end_km: string
    running_km: string
    vehicle_kpl: string
    fuel_quantity_liter: string
    fuel_cost_per_liter: string
    fuel_supplier_id: string
    fuel_type: string
    demurrage_days: string
    total_demurrage: string
    demurrage_total_rent: string
    vendor_demurrage_days: string
    vendor_total_demurrage: string
    vendor_rent: string
    vendor_rent_demurrage_total: string
    rent_advance: string
    advance: string
    due_amount: string
    driver_advance: string
    driver_commission_percent: string
    driver_commission_amount: string
    fuel_cost: string
    labour_cost: string
    toll_cost: string
    ferry_cost: string
    police_cost: string
    chada_cost: string
    parking_cost: string
    challan_cost: string
    food_cost: string
    others_cost: string
    night_guard: string
    additional_load_cost: string
    total_expense: string
    remarks: string
    status: string
}

const TRIP_TYPE_OPTIONS = [
    { label: 'Single', value: 'single' },
    { label: 'Round', value: 'round' },
]

const TRANSPORT_TYPE_OPTIONS = [
    { label: 'Own Transport', value: 'own_transport' },
    { label: 'Vendor Transport', value: 'vendor_transport' },
]

const FUEL_TYPE_OPTIONS = [
    { label: 'Diesel', value: 'diesel' },
    { label: 'Octane', value: 'octane' },
    { label: 'Petrol', value: 'petrol' },
    { label: 'Gas', value: 'gas' },
    { label: 'LPG', value: 'lpg' },
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

function toStringValue(value: unknown): string {
    if (value === null || typeof value === 'undefined') return ''
    return String(value)
}

function toNumberValue(value: unknown): number {
    if (value === null || typeof value === 'undefined' || value === '') return 0
    const numericValue = typeof value === 'number' ? value : Number(value)
    return Number.isNaN(numericValue) ? 0 : numericValue
}

function toNumberInputString(value: number): string {
    if (!Number.isFinite(value)) return ''
    return value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d*[1-9])0+$/, '$1')
}

function sumAmountFields(values: Array<string | number | null | undefined>): string {
    const total = values.reduce<number>((acc, value) => acc + toNumberValue(value), 0)
    return toNumberInputString(total)
}

function getCustomerAddresses(customer?: { address?: CustomerAddressItem[] | string | null } | null): CustomerAddressItem[] {
    if (!customer || !Array.isArray(customer.address)) return []
    return customer.address.filter((item): item is CustomerAddressItem => Boolean(item && typeof item === 'object'))
}

function buildAreaOptions(
    areas: CustomerAddressItem[],
    fallback?: { id?: number | string | null; name?: string | null; address?: string | null } | null,
) {
    const options = areas
        .filter((item) => item.id !== null && typeof item.id !== 'undefined')
        .map((item) => ({
            label: `${item.name}${item.address ? ` - ${item.address}` : ''}`,
            value: String(item.id),
        }))

    if (fallback?.id !== null && typeof fallback?.id !== 'undefined') {
        const fallbackValue = String(fallback.id)
        if (!options.some((option) => option.value === fallbackValue)) {
            options.unshift({
                label: `${fallback.name || fallbackValue}${fallback.address ? ` - ${fallback.address}` : ''}`,
                value: fallbackValue,
            })
        }
    }

    return options
}

type CustomerAddressSource = {
    id: number
    name: string
    mobile?: string | null
    address?: CustomerAddressItem[] | string | null
}

type PersonSummaryLike = {
    id: number
    name: string
    mobile?: string | null
    phone?: string | null
}

function toPersonOptions(people?: PersonSummaryLike[] | null, fallback?: PersonSummaryLike | null) {
    const optionMap = new Map<string, { label: string; value: string }>()
    const list = [
        ...(people || []),
        ...(fallback ? [fallback] : []),
    ]

    list.forEach((person) => {
        const value = String(person.id)
        if (optionMap.has(value)) return
        optionMap.set(value, {
            label: `${person.name}${person.mobile ? ` (${person.mobile})` : person.phone ? ` (${person.phone})` : ''}`,
            value,
        })
    })

    return Array.from(optionMap.values())
}

export default function TripForm({
                                     tenantSlug,
                                     customers,
                                     offices,
                                     unloadAreas,
                                     vendors,
                                     vehicles,
                                     rentVehicles,
                                     vehicleCategories,
                                     suppliers,
                                     initialData,
                                     tripId,
                                     submitLabel = 'Save Trip',
                                 }: TripFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [routeDistance, setRouteDistance] = useState<number | null>(null)
    const [calculatingDistance, setCalculatingDistance] = useState(false)
    const [routeDistanceSource, setRouteDistanceSource] = useState<'route_pricing' | 'google_maps' | null>(null)
    const initialDate = toDateInputValue(initialData?.date)
    const isEditMode = typeof tripId !== 'undefined' && tripId !== null && String(tripId).trim() !== ''
    const [availableUnloadAreas, setAvailableUnloadAreas] = useState<RoutePricingArea[]>(unloadAreas)
    const [unloadAreaSearch, setUnloadAreaSearch] = useState('')
    const [unloadAreaSearchResults, setUnloadAreaSearchResults] = useState<RoutePricingArea[]>([])
    const [unloadAreaSearching, setUnloadAreaSearching] = useState(false)
    const [availableCustomers, setAvailableCustomers] = useState<Customer[]>(customers)
    const [availableOffices, setAvailableOffices] = useState<Office[]>(offices)
    const [availableSuppliers, setAvailableSuppliers] = useState<Supplier[]>(suppliers)
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerAddressSource | null>(
        (() => {
            const initialCustomerId = toStringValue(initialData?.customer_id ?? initialData?.customer?.id)
            return (customers.find((item) => String(item.id) === initialCustomerId) as CustomerAddressSource | undefined)
                || (initialData?.customer as CustomerAddressSource | undefined)
                || null
        })(),
    )
    const initialOwnVehicleId = toStringValue(initialData?.vehicle_id ?? initialData?.vehicle?.id)
    const initialVendorVehicleId = toStringValue(initialData?.rent_vehicle_id ?? initialData?.rent_vehicle?.id)
    const [selectedOwnVehicle, setSelectedOwnVehicle] = useState<Vehicle | null>(
        (() => vehicles.find((item) => String(item.id) === initialOwnVehicleId) || null)(),
    )
    const [selectedVendorVehicle, setSelectedVendorVehicle] = useState<RentVehicle | null>(
        (() => rentVehicles.find((item) => String(item.id) === initialVendorVehicleId) || null)(),
    )
    const fuelSyncSourceRef = useRef<'odometer_end' | 'fuel_cost' | null>(null)
    const [lastOdometerReading, setLastOdometerReading] = useState<{
        has_reading: boolean
        odometer_start_km: number | null
        last_trip: {
            id: number
            date: string
            challan_no: string
            odometer_start_km: number
            odometer_end_km: number
            running_km: number
        } | null
    } | null>(null)
    const initialSupervisor = (initialData?.supervisor as PersonSummaryLike | undefined) || null

    const [form, setForm] = useState<TripFormState>({
        date: initialDate || (isEditMode ? '' : getTodayDateInputValue()),
        customer_id: toStringValue(initialData?.customer_id ?? initialData?.customer?.id),
        office_id: toStringValue(initialData?.office_id ?? initialData?.office?.id),
        load_area_id: toStringValue(initialData?.load_area_id ?? initialData?.load_area?.id),
        unload_area_id: toStringValue(initialData?.unload_area_id ?? initialData?.unload_area?.id),
        trip_type: toStringValue(initialData?.trip_type),
        additional_unload_point: toStringValue(initialData?.additional_unload_point),
        sender_name: toStringValue(initialData?.sender_name),
        product_details: toStringValue(initialData?.product_details),
        transport_type: toStringValue(initialData?.transport_type),
        vendor_id: toStringValue(initialData?.vendor_id ?? initialData?.vendor?.id),
        vehicle_id: toStringValue(initialData?.vehicle_id ?? initialData?.vehicle?.id),
        rent_vehicle_id: toStringValue(initialData?.rent_vehicle_id ?? initialData?.rent_vehicle?.id),
        vehicle_no: toStringValue(initialData?.vehicle_no || initialData?.vehicle?.registration_number || initialData?.vehicle?.registration_no || initialData?.rent_vehicle?.registration_number),
        driver_name: toStringValue(initialData?.driver_name),
        driver_id: toStringValue(initialData?.driver_id ?? initialData?.driver?.id),
        helper_id: toStringValue(initialData?.helper_id ?? initialData?.helper?.id),
        supervisor_id: toStringValue(initialData?.supervisor_id ?? initialData?.supervisor?.id),
        vehicle_category_id: toStringValue(initialData?.vehicle_category_id ?? initialData?.vehicle_category?.id),
        vehicle_size_id: toStringValue(initialData?.vehicle_size_id ?? initialData?.vehicle_size?.id),
        challan_no: toStringValue(initialData?.challan_no),
        total_rent_bill_amount: toStringValue(initialData?.total_rent_bill_amount),
        odometer_start_km: toStringValue(initialData?.odometer_start_km),
        odometer_end_km: toStringValue(initialData?.odometer_end_km),
        running_km: toStringValue(initialData?.running_km),
        vehicle_kpl: toStringValue(initialData?.vehicle_kpl),
        fuel_quantity_liter: toStringValue(initialData?.fuel_quantity_liter),
        fuel_cost_per_liter: toStringValue(initialData?.fuel_cost_per_liter),
        fuel_supplier_id: toStringValue(initialData?.fuel_supplier_id ?? initialData?.fuel_supplier?.id),
        fuel_type: toStringValue(initialData?.fuel_type),
        demurrage_days: toStringValue(initialData?.demurrage_days),
        total_demurrage: toStringValue(initialData?.total_demurrage),
        demurrage_total_rent: toStringValue(initialData?.demurrage_total_rent),
        vendor_demurrage_days: toStringValue(initialData?.vendor_demurrage_days),
        vendor_total_demurrage: toStringValue(initialData?.vendor_total_demurrage),
        vendor_rent: toStringValue(initialData?.vendor_rent),
        vendor_rent_demurrage_total: toStringValue(initialData?.vendor_rent_demurrage_total),
        rent_advance: toStringValue(initialData?.rent_advance),
        advance: toStringValue(initialData?.advance),
        due_amount: toStringValue(initialData?.due_amount),
        driver_advance: toStringValue(initialData?.driver_advance),
        driver_commission_percent: toStringValue(initialData?.driver_commission_percent),
        driver_commission_amount: toStringValue(initialData?.driver_commission_amount),
        fuel_cost: toStringValue(initialData?.fuel_cost),
        labour_cost: toStringValue(initialData?.labour_cost),
        toll_cost: toStringValue(initialData?.toll_cost),
        ferry_cost: toStringValue(initialData?.ferry_cost),
        police_cost: toStringValue(initialData?.police_cost),
        chada_cost: toStringValue(initialData?.chada_cost),
        parking_cost: toStringValue(initialData?.parking_cost),
        challan_cost: toStringValue(initialData?.challan_cost),
        food_cost: toStringValue(initialData?.food_cost),
        others_cost: toStringValue(initialData?.others_cost),
        night_guard: toStringValue(initialData?.night_guard),
        additional_load_cost: toStringValue(initialData?.additional_load_cost),
        total_expense: toStringValue(initialData?.total_expense),
        remarks: toStringValue(initialData?.remarks),
        status: initialData?.status === 0 ? '0' : '1',
    })

    const customerOptions = availableCustomers.map((customer) => ({
        label: `${customer.name}${customer.creation_type === 2 ? ' (Walk In Customer)' : customer.mobile ? ` (${customer.mobile})` : ''}`,
        value: String(customer.id),
    }))
    const officeOptions = availableOffices.map((office) => ({
        label: office.branch_name,
        value: String(office.id),
    }))
    const vendorOptions = vendors.map((vendor) => ({
        label: `${vendor.name}${vendor.creation_type === 2 ? ' (Walk In Supplier)' : vendor.mobile ? ` (${vendor.mobile})` : ''}`,
        value: String(vendor.id),
    }))
    const supplierOptions = availableSuppliers.map((supplier) => ({
        label: `${supplier.name}${supplier.creation_type === 2 ? ' (Walk In Supplier)' : supplier.mobile ? ` (${supplier.mobile})` : ''}`,
        value: String(supplier.id),
    }))
    const ownVehicleOptions = vehicles.map((vehicle) => ({
        label: `${vehicle.vehicle_name || 'N/A'} (${vehicle.registration_no || 'N/A'})`,
        value: String(vehicle.id),
    }))
    const selectedOwnVehicleId = form.vehicle_id.trim()
    const hasSelectedOwnVehicleOption = ownVehicleOptions.some((option) => option.value === selectedOwnVehicleId)
    const mergedOwnVehicleOptions = !selectedOwnVehicleId || hasSelectedOwnVehicleOption
        ? ownVehicleOptions
        : [
            {
                label: `${selectedOwnVehicle?.vehicle_name || initialData?.vehicle?.vehicle_name || selectedOwnVehicleId} (${selectedOwnVehicle?.registration_no || selectedOwnVehicle?.registration_number || initialData?.vehicle?.registration_no || selectedOwnVehicleId})`,
                value: selectedOwnVehicleId,
            },
            ...ownVehicleOptions,
        ]
    const selectedVendorId = form.vendor_id.trim()
    const scopedVendorVehicles = selectedVendorId
        ? rentVehicles.filter((vehicle) => String(vehicle.vendor_id) === selectedVendorId)
        : []
    const vendorVehicleOptions = scopedVendorVehicles.map((vehicle) => ({
        label: `${vehicle.vehicle_name || 'N/A'} (${vehicle.registration_number || 'N/A'})`,
        value: String(vehicle.id),
    }))
    const selectedVendorVehicleId = form.rent_vehicle_id.trim()
    const hasSelectedVendorVehicleOption = vendorVehicleOptions.some((option) => option.value === selectedVendorVehicleId)
    const mergedVendorVehicleOptions = !selectedVendorVehicleId || hasSelectedVendorVehicleOption
        ? vendorVehicleOptions
        : [
            {
                label: `${selectedVendorVehicle?.vehicle_name || initialData?.rent_vehicle?.vehicle_name || selectedVendorVehicleId} (${selectedVendorVehicle?.registration_number || initialData?.rent_vehicle?.registration_number || selectedVendorVehicleId})`,
                value: selectedVendorVehicleId,
            },
            ...vendorVehicleOptions,
        ]
    const loadPointOptions = buildAreaOptions(getCustomerAddresses(selectedCustomer), initialData?.load_area)
    const unloadPointOptions = (unloadAreaSearch.length >= 3 ? unloadAreaSearchResults : availableUnloadAreas).map((area) => ({
        label: area.name,
        value: String(area.id),
    }))

    const isOwnTransport = form.transport_type === 'own_transport'
    const isVendorTransport = form.transport_type === 'vendor_transport'

    const activeVehicle = isOwnTransport ? selectedOwnVehicle : isVendorTransport ? selectedVendorVehicle : null
    const activeVehicleCategoryName =
        activeVehicle?.vehicle_category?.name
        || (form.vehicle_category_id
            ? vehicleCategories.find((item) => String(item.id) === form.vehicle_category_id)?.name || ''
            : '')
        || toStringValue(initialData?.vehicle_category?.name)
    const activeVehicleSizeName =
        activeVehicle?.vehicle_size?.name
        || (form.vehicle_size_id
            ? vehicleCategories
            .flatMap((item) => item.sizes || [])
            .find((size) => String(size.id) === form.vehicle_size_id)?.name || ''
            : '')
        || toStringValue(initialData?.vehicle_size?.name)
    const activeOwnVehicleKpl = isOwnTransport
        ? toStringValue(selectedOwnVehicle?.vehicle_kpl ?? initialData?.vehicle_kpl ?? form.vehicle_kpl)
        : ''
    const activeVehicleDriverOptions = isOwnTransport
        ? getOwnVehicleDriverOptions(selectedOwnVehicle)
        : isVendorTransport
            ? getVendorVehicleDriverOptions(selectedVendorVehicle)
            : []
    const activeVendorDriverName = isVendorTransport
        ? toStringValue(
            selectedVendorVehicle?.driver_name
            || selectedVendorVehicle?.driver?.name
            || selectedVendorVehicle?.vendor_driver?.name,
        )
        : ''
    const activeVehicleHelperOptions = isOwnTransport ? getOwnVehicleHelperOptions(selectedOwnVehicle) : []
    const activeVehicleSupervisorOptions = isOwnTransport ? toPersonOptions(selectedOwnVehicle?.supervisors, initialSupervisor) : []
    const odometerStartValue = toNumberValue(form.odometer_start_km)
    const odometerEndValue = toNumberValue(form.odometer_end_km)
    const vehicleKplValue = toNumberValue(form.vehicle_kpl)

    // Use route distance if available and odometer readings not provided, otherwise use odometer distance
    const odometerDistance = odometerEndValue > odometerStartValue ? odometerEndValue - odometerStartValue : 0

    // Prioritize odometer distance over route distance (odometer is more accurate for actual trip)
    const actualDistanceValue = isOwnTransport
        ? (odometerDistance > 0 ? odometerDistance : (routeDistance !== null && routeDistance > 0 ? routeDistance : 0))
        : 0

    const actualFuelQuantityValue = isOwnTransport && vehicleKplValue > 0 && actualDistanceValue > 0
        ? actualDistanceValue / vehicleKplValue
        : 0
    const driverCommissionAmountText = form.driver_commission_percent.trim() && form.total_rent_bill_amount.trim()
        ? toNumberInputString(
            toNumberValue(form.total_rent_bill_amount) * toNumberValue(form.driver_commission_percent) / 100,
        )
        : ''
    const demurrageTotalRentText = form.total_rent_bill_amount.trim() || form.total_demurrage.trim()
        ? toNumberInputString(toNumberValue(form.total_rent_bill_amount) + toNumberValue(form.total_demurrage))
        : ''
    const fuelCostText = isOwnTransport && actualFuelQuantityValue > 0 && form.fuel_cost_per_liter.trim()
        ? toNumberInputString(actualFuelQuantityValue * toNumberValue(form.fuel_cost_per_liter))
        : ''
    const resolvedFuelCostText = fuelSyncSourceRef.current === 'fuel_cost'
        ? form.fuel_cost
        : (fuelCostText || form.fuel_cost)
    const vendorRentDemurrageText = isVendorTransport && (form.vendor_rent.trim() || form.vendor_total_demurrage.trim())
        ? toNumberInputString(toNumberValue(form.vendor_rent) + toNumberValue(form.vendor_total_demurrage))
        : ''
    const rentDueAmountText = demurrageTotalRentText || form.rent_advance.trim()
        ? toNumberInputString(toNumberValue(demurrageTotalRentText) - toNumberValue(form.rent_advance))
        : ''
    const vendorAdvanceDueText = isVendorTransport && (vendorRentDemurrageText || form.advance.trim())
        ? toNumberInputString(toNumberValue(vendorRentDemurrageText) - toNumberValue(form.advance))
        : ''
    const expenseSourceValues = [
        driverCommissionAmountText,
        resolvedFuelCostText,
        form.labour_cost,
        form.toll_cost,
        form.ferry_cost,
        form.police_cost,
        form.chada_cost,
        form.parking_cost,
        form.challan_cost,
        form.food_cost,
        form.others_cost,
        form.night_guard,
        form.additional_load_cost,
    ]
    const totalExpenseText = isOwnTransport && expenseSourceValues.some((value) => String(value || '').trim() !== '')
        ? sumAmountFields(expenseSourceValues)
        : ''

    useEffect(() => {
        const currentCustomerId = form.customer_id.trim()
        if (!currentCustomerId) {
            setSelectedCustomer(null)
            return
        }

        const localCustomer = availableCustomers.find((item) => String(item.id) === currentCustomerId) || null
        if (getCustomerAddresses(localCustomer).length > 0) {
            setSelectedCustomer(localCustomer)
            return
        }

        setSelectedCustomer(localCustomer)
        let active = true
        void (async () => {
            try {
                const res = await getCustomerAction(tenantSlug, currentCustomerId)
                if (active && res.success && res.data) {
                    setSelectedCustomer(res.data)
                }
            } catch {
                // Keep the form usable if the customer lookup fails.
            }
        })()

        return () => {
            active = false
        }
    }, [availableCustomers, form.customer_id, tenantSlug])

    useEffect(() => {
        fuelSyncSourceRef.current = null
        if (form.transport_type === 'own_transport') {
            setField('vendor_id', '')
            setField('rent_vehicle_id', '')
            setField('driver_name', '')
            setField('driver_id', '')
            setField('helper_id', '')
            setField('supervisor_id', '')
            setField('vehicle_category_id', '')
            setField('vehicle_size_id', '')
            setField('vehicle_kpl', '')
            setField('vehicle_no', '')
        } else if (form.transport_type === 'vendor_transport') {
            setField('vehicle_id', '')
            setField('driver_id', '')
            setField('helper_id', '')
            setField('supervisor_id', '')
            setField('vehicle_category_id', '')
            setField('vehicle_size_id', '')
            setField('vehicle_kpl', '')
            setField('vehicle_no', '')
        }
    }, [form.transport_type])

    useEffect(() => {
        if (!isOwnTransport) return
        if (fuelSyncSourceRef.current) return

        if (form.fuel_cost.trim() && !form.odometer_end_km.trim()) {
            fuelSyncSourceRef.current = 'fuel_cost'
        } else if (form.odometer_end_km.trim() && !form.fuel_cost.trim()) {
            fuelSyncSourceRef.current = 'odometer_end'
        }
    }, [isOwnTransport, form.fuel_cost, form.odometer_end_km])

    useEffect(() => {
        const currentVehicleId = form.vehicle_id.trim()
        if (!currentVehicleId) {
            setSelectedOwnVehicle(null)
            return
        }

        const matchedVehicle = vehicles.find((item) => String(item.id) === currentVehicleId) || null
        if (matchedVehicle) {
            setSelectedOwnVehicle(matchedVehicle)

            const hasDetails = Boolean(
                matchedVehicle.vehicle_category?.id
                || matchedVehicle.vehicle_size?.id
                || matchedVehicle.vehicle_kpl
                || matchedVehicle.drivers?.length
                || matchedVehicle.driver
                || matchedVehicle.helpers?.length
                || matchedVehicle.helper
                || matchedVehicle.supervisors?.length,
            )
            if (hasDetails) return
        }

        let active = true
        void (async () => {
            try {
                const res = await getVehicleAction(tenantSlug, currentVehicleId)
                if (active && res.success && res.data) {
                    setSelectedOwnVehicle(res.data)
                }
            } catch {
                // keep the current form usable if vehicle lookup fails
            }
        })()

        return () => {
            active = false
        }
    }, [form.vehicle_id, tenantSlug, vehicles])

    useEffect(() => {
        const currentVehicleId = form.rent_vehicle_id.trim()
        if (!currentVehicleId) {
            setSelectedVendorVehicle(null)
            if (form.driver_name) setField('driver_name', '')
            return
        }

        const matchedVehicle = rentVehicles.find((item) => String(item.id) === currentVehicleId) || null
        if (matchedVehicle) {
            setSelectedVendorVehicle(matchedVehicle)

            const hasDetails = Boolean(
                matchedVehicle.vehicle_category?.id
                || matchedVehicle.vehicle_size?.id
                || matchedVehicle.driver
                || matchedVehicle.vendor_driver,
            )
            if (hasDetails) return
        }

        let active = true
        void (async () => {
            try {
                const res = await getRentVehicleAction(tenantSlug, currentVehicleId)
                if (active && res.success && res.data) {
                    setSelectedVendorVehicle(res.data)
                }
            } catch {
                // keep the current form usable if rent vehicle lookup fails
            }
        })()

        return () => {
            active = false
        }
    }, [form.rent_vehicle_id, rentVehicles, tenantSlug, form.driver_name])

    useEffect(() => {
        if (!isOwnTransport || !selectedOwnVehicle) return
        const nextVehicleNo = toStringValue(selectedOwnVehicle.registration_no || selectedOwnVehicle.registration_number)
        const nextVehicleCategoryId = toStringValue(selectedOwnVehicle.vehicle_category_id ?? selectedOwnVehicle.vehicle_category?.id)
        const nextVehicleSizeId = toStringValue(selectedOwnVehicle.vehicle_size_id ?? selectedOwnVehicle.vehicle_size?.id)
        const nextVehicleKpl = toStringValue(selectedOwnVehicle.vehicle_kpl)
        const driverOptions = getOwnVehicleDriverOptions(selectedOwnVehicle)
        const helperOptions = getOwnVehicleHelperOptions(selectedOwnVehicle)

        if (form.vehicle_no !== nextVehicleNo) setField('vehicle_no', nextVehicleNo)
        if (form.vehicle_category_id !== nextVehicleCategoryId) setField('vehicle_category_id', nextVehicleCategoryId)
        if (form.vehicle_size_id !== nextVehicleSizeId) setField('vehicle_size_id', nextVehicleSizeId)
        if (form.vehicle_kpl !== nextVehicleKpl) setField('vehicle_kpl', nextVehicleKpl)

        if (driverOptions.length === 1) {
            if (form.driver_id !== driverOptions[0].value) setField('driver_id', driverOptions[0].value)
        } else if (!driverOptions.some((option) => option.value === form.driver_id) && form.driver_id) {
            setField('driver_id', '')
        }

        if (helperOptions.length === 1) {
            if (form.helper_id !== helperOptions[0].value) setField('helper_id', helperOptions[0].value)
        } else if (!helperOptions.some((option) => option.value === form.helper_id) && form.helper_id) {
            setField('helper_id', '')
        }

        const supervisorOptions = getOwnVehicleSupervisorOptions(selectedOwnVehicle, initialSupervisor)
        if (supervisorOptions.length === 1) {
            if (form.supervisor_id !== supervisorOptions[0].value) setField('supervisor_id', supervisorOptions[0].value)
        } else if (!supervisorOptions.some((option) => option.value === form.supervisor_id) && form.supervisor_id) {
            setField('supervisor_id', '')
        }
    }, [
        isOwnTransport,
        selectedOwnVehicle,
        initialSupervisor,
        form.driver_id,
        form.helper_id,
        form.supervisor_id,
        form.vehicle_category_id,
        form.vehicle_size_id,
        form.vehicle_kpl,
        form.vehicle_no,
    ])

    useEffect(() => {
        if (!isVendorTransport || !selectedVendorVehicle) return
        const nextVehicleNo = toStringValue(selectedVendorVehicle.registration_number)
        const nextVehicleCategoryId = toStringValue(selectedVendorVehicle.vehicle_category_id ?? selectedVendorVehicle.vehicle_category?.id)
        const nextVehicleSizeId = toStringValue(selectedVendorVehicle.vehicle_size_id ?? selectedVendorVehicle.vehicle_size?.id)
        const driverOptions = getVendorVehicleDriverOptions(selectedVendorVehicle)
        const nextDriverName = toStringValue(
            selectedVendorVehicle.driver_name
            || selectedVendorVehicle.driver?.name
            || selectedVendorVehicle.vendor_driver?.name,
        )

        if (form.vehicle_no !== nextVehicleNo) setField('vehicle_no', nextVehicleNo)
        if (form.vehicle_category_id !== nextVehicleCategoryId) setField('vehicle_category_id', nextVehicleCategoryId)
        if (form.vehicle_size_id !== nextVehicleSizeId) setField('vehicle_size_id', nextVehicleSizeId)
        if (form.vehicle_kpl) setField('vehicle_kpl', '')
        if (form.driver_name !== nextDriverName) setField('driver_name', nextDriverName)

        if (driverOptions.length === 1) {
            if (form.driver_id !== driverOptions[0].value) setField('driver_id', driverOptions[0].value)
        } else if (!driverOptions.some((option) => option.value === form.driver_id) && form.driver_id) {
            setField('driver_id', '')
        }

        if (form.helper_id) setField('helper_id', '')
        if (form.supervisor_id) setField('supervisor_id', '')
    }, [
        isVendorTransport,
        selectedVendorVehicle,
        form.driver_name,
        form.driver_id,
        form.helper_id,
        form.supervisor_id,
        form.vehicle_category_id,
        form.vehicle_size_id,
        form.vehicle_kpl,
        form.vehicle_no,
    ])

    useEffect(() => {
        if (!isOwnTransport) return

        const nextRunningKm = actualDistanceValue > 0 ? toNumberInputString(actualDistanceValue) : ''
        const nextFuelQuantity = actualFuelQuantityValue > 0
            ? toNumberInputString(actualFuelQuantityValue)
            : ''

        if (form.running_km !== nextRunningKm) setField('running_km', nextRunningKm)
        if (form.fuel_quantity_liter !== nextFuelQuantity) setField('fuel_quantity_liter', nextFuelQuantity)
        if (form.driver_commission_amount !== driverCommissionAmountText) setField('driver_commission_amount', driverCommissionAmountText)
        if (form.demurrage_total_rent !== demurrageTotalRentText) {
            setField('demurrage_total_rent', demurrageTotalRentText)
        }
        if (isVendorTransport && form.vendor_rent_demurrage_total !== vendorRentDemurrageText) {
            setField('vendor_rent_demurrage_total', vendorRentDemurrageText)
        }
        if (form.total_expense !== totalExpenseText) setField('total_expense', totalExpenseText)
    }, [
        isOwnTransport,
        isVendorTransport,
        actualDistanceValue,
        actualFuelQuantityValue,
        odometerStartValue,
        odometerEndValue,
        vehicleKplValue,
        routeDistance,
        driverCommissionAmountText,
        fuelCostText,
        demurrageTotalRentText,
        vendorRentDemurrageText,
        totalExpenseText,
        form.running_km,
        form.fuel_quantity_liter,
        form.fuel_cost,
        form.driver_commission_amount,
        form.demurrage_total_rent,
        form.vendor_rent_demurrage_total,
        form.total_expense,
    ])

    // Separate effect to handle route distance changes
    useEffect(() => {
        console.log('[TripForm] Distance changed:', { routeDistance, actualDistanceValue })
        if (isOwnTransport && routeDistance !== null && routeDistance > 0) {
            const nextRunningKm = toNumberInputString(routeDistance)
            if (form.running_km !== nextRunningKm) {
                console.log('[TripForm] Updating running_km field:', nextRunningKm)
                setField('running_km', nextRunningKm)
            }
        }
    }, [isOwnTransport, routeDistance])

    // Update fuel quantity when vehicle KPL changes
    useEffect(() => {
        console.log('[TripForm] Fuel calculation:', { vehicleKplValue, actualDistanceValue, actualFuelQuantityValue })
        if (isOwnTransport && vehicleKplValue > 0 && actualDistanceValue > 0) {
            const nextFuelQuantity = toNumberInputString(actualDistanceValue / vehicleKplValue)
            if (form.fuel_quantity_liter !== nextFuelQuantity) {
                console.log('[TripForm] Updating fuel_quantity_liter field:', nextFuelQuantity)
                setField('fuel_quantity_liter', nextFuelQuantity)
            }
        }
    }, [isOwnTransport, vehicleKplValue, actualDistanceValue])

    // Auto-calculate fuel cost when odometer values change (FORWARD)
    useEffect(() => {
        if (!isOwnTransport) return
        if (fuelSyncSourceRef.current !== 'odometer_end') return

        const fuelCostPerLiter = toNumberValue(form.fuel_cost_per_liter)
        const odometerStartValue = toNumberValue(form.odometer_start_km)
        const vehicleKplValue = toNumberValue(form.vehicle_kpl)
        const odometerEndValue = toNumberValue(form.odometer_end_km)

        // Only calculate if all required values are present
        if (form.odometer_start_km.trim() !== '' && odometerEndValue > odometerStartValue && fuelCostPerLiter > 0 && vehicleKplValue > 0) {
            const distance = odometerEndValue - odometerStartValue
            const fuelQuantity = distance / vehicleKplValue
            const calculatedFuelCost = fuelQuantity * fuelCostPerLiter

            const nextFuelCost = toNumberInputString(calculatedFuelCost)
            if (form.fuel_cost !== nextFuelCost) {
                console.log('[TripForm] Auto-calculating fuel_cost from odometer:', nextFuelCost)
                setField('fuel_cost', nextFuelCost)
            }
        }
    }, [isOwnTransport, form.odometer_end_km, form.fuel_cost_per_liter, form.odometer_start_km, form.vehicle_kpl])

    // Auto-calculate odometer end when fuel cost changes (REVERSE)
    useEffect(() => {
        if (!isOwnTransport) return
        if (fuelSyncSourceRef.current !== 'fuel_cost') return

        const fuelCostPerLiter = toNumberValue(form.fuel_cost_per_liter)
        const odometerStartValue = toNumberValue(form.odometer_start_km)
        const vehicleKplValue = toNumberValue(form.vehicle_kpl)
        const fuelCostValue = toNumberValue(form.fuel_cost)

        // Only calculate if all required values are present
        if (form.odometer_start_km.trim() !== '' && fuelCostValue > 0 && fuelCostPerLiter > 0 && vehicleKplValue > 0) {
            const fuelQuantity = fuelCostValue / fuelCostPerLiter
            const distance = fuelQuantity * vehicleKplValue
            const calculatedOdometerEnd = odometerStartValue + distance

            const nextOdometerEnd = toNumberInputString(calculatedOdometerEnd)
            if (form.odometer_end_km !== nextOdometerEnd) {
                console.log('[TripForm] Auto-calculating odometer_end_km from fuel cost:', nextOdometerEnd)
                setField('odometer_end_km', nextOdometerEnd)
            }
        }
    }, [isOwnTransport, form.fuel_cost, form.fuel_cost_per_liter, form.odometer_start_km, form.vehicle_kpl])

    useEffect(() => {
        if (isOwnTransport) return
        if (form.demurrage_total_rent !== demurrageTotalRentText) {
            setField('demurrage_total_rent', demurrageTotalRentText)
        }
    }, [isOwnTransport, demurrageTotalRentText, form.demurrage_total_rent])

    useEffect(() => {
        if (!isEditMode && form.date && form.challan_no === '') {
            let active = true
            void (async () => {
                try {
                    const res = await getNextChallanNoAction(tenantSlug, form.date)
                    if (active && res.success && res.data?.challan_no) {
                        setField('challan_no', res.data.challan_no)
                    }
                } catch {
                    // Keep the form usable if challan_no generation fails
                }
            })()

            return () => {
                active = false
            }
        }
    }, [isEditMode, tenantSlug, form.date])

    useEffect(() => {
        const loadAreaId = parseInt(form.load_area_id)
        const unloadAreaId = parseInt(form.unload_area_id)

        console.log('[TripForm] Distance fetch triggered:', { loadAreaId, unloadAreaId })

        if (loadAreaId > 0 && unloadAreaId > 0) {
            let active = true
            void (async () => {
                try {
                    console.log('[TripForm] Step 1: Fetching from route pricing...')
                    const res = await getRouteDistanceAction(tenantSlug, loadAreaId, unloadAreaId)
                    console.log('[TripForm] Route pricing response:', res)

                    if (active && res.success && res.data?.distance !== undefined && res.data.distance > 0) {
                        console.log('[TripForm] Route pricing distance found:', res.data.distance)
                        setRouteDistance(res.data.distance)
                        setRouteDistanceSource('route_pricing')
                    } else if (active) {
                        console.log('[TripForm] No route pricing distance, trying Google Maps...')
                        setCalculatingDistance(true)
                        try {
                            const googleMapsRes = await calculateRouteDistanceByGoogleMapsAction(tenantSlug, loadAreaId, unloadAreaId)
                            console.log('[TripForm] Google Maps response:', googleMapsRes)

                            if (active && googleMapsRes.success && googleMapsRes.data?.distance !== undefined) {
                                console.log('[TripForm] Google Maps distance found:', googleMapsRes.data.distance)
                                setRouteDistance(googleMapsRes.data.distance)
                                setRouteDistanceSource('google_maps')
                            } else {
                                console.log('[TripForm] Google Maps failed, no distance available')
                                setRouteDistance(null)
                                setRouteDistanceSource(null)
                            }
                        } catch (error) {
                            console.log('[TripForm] Google Maps exception:', error)
                            // If Google Maps fails, just set distance to null
                            setRouteDistance(null)
                            setRouteDistanceSource(null)
                        } finally {
                            if (active) setCalculatingDistance(false)
                        }
                    }
                } catch (error) {
                    console.log('[TripForm] Distance fetch error:', error)
                    // Keep the form usable if distance fetch fails
                    setRouteDistance(null)
                    setRouteDistanceSource(null)
                }
            })()

            return () => {
                active = false
            }
        } else {
            console.log('[TripForm] Load/unload areas not selected yet')
            setRouteDistance(null)
            setRouteDistanceSource(null)
        }
    }, [tenantSlug, form.load_area_id, form.unload_area_id])

    // Debounced server-side search for unload areas
    useEffect(() => {
        // Don't search if less than 3 characters
        if (unloadAreaSearch.length < 3) {
            setUnloadAreaSearchResults([])
            setUnloadAreaSearching(false)
            return
        }

        setUnloadAreaSearching(true)

        // Debounce: wait 500ms after user stops typing
        const timeoutId = setTimeout(async () => {
            try {
                const res = await getAreasClient(unloadAreaSearch)
                if (res.success && res.data?.data) {
                    setUnloadAreaSearchResults(res.data.data)
                } else {
                    setUnloadAreaSearchResults([])
                }
            } catch (error) {
                console.error('[TripForm] Failed to search unload areas:', error)
                setUnloadAreaSearchResults([])
            } finally {
                setUnloadAreaSearching(false)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [unloadAreaSearch])

    useEffect(() => {
        if (form.due_amount !== rentDueAmountText) {
            setField('due_amount', rentDueAmountText)
        }
    }, [rentDueAmountText, form.due_amount])

    function setField<K extends keyof TripFormState>(key: K, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    function handleOdometerEndChange(value: string) {
        fuelSyncSourceRef.current = 'odometer_end'
        setField('odometer_end_km', value)
    }

    function handleFuelCostChange(value: string) {
        fuelSyncSourceRef.current = 'fuel_cost'
        setField('fuel_cost', value)
    }

    function getOwnVehicleDriverOptions(vehicle?: Vehicle | null) {
        return toPersonOptions(vehicle?.drivers, vehicle?.driver || null)
    }

    function getOwnVehicleHelperOptions(vehicle?: Vehicle | null) {
        return toPersonOptions(vehicle?.helpers, vehicle?.helper || null)
    }

    function getOwnVehicleSupervisorOptions(vehicle?: Vehicle | null, fallback?: PersonSummaryLike | null) {
        return toPersonOptions(vehicle?.supervisors, fallback)
    }

    function getVendorVehicleDriverOptions(vehicle?: RentVehicle | null) {
        return toPersonOptions(
            vehicle?.driver ? [vehicle.driver] : undefined,
            vehicle?.vendor_driver ? { id: vehicle.vendor_driver.id, name: vehicle.vendor_driver.name } : null,
        )
    }

    function applyOwnVehicleSelection(nextVehicle?: Vehicle | null) {
        if (!nextVehicle) return

        const nextVehicleNo = toStringValue(nextVehicle.registration_no || nextVehicle.registration_number)
        const nextVehicleCategoryId = toStringValue(nextVehicle.vehicle_category_id ?? nextVehicle.vehicle_category?.id)
        const nextVehicleSizeId = toStringValue(nextVehicle.vehicle_size_id ?? nextVehicle.vehicle_size?.id)
        const nextVehicleKpl = toStringValue(nextVehicle.vehicle_kpl)
        const driverOptions = getOwnVehicleDriverOptions(nextVehicle)
        const helperOptions = getOwnVehicleHelperOptions(nextVehicle)
        const supervisorOptions = getOwnVehicleSupervisorOptions(nextVehicle, initialSupervisor)

        setField('vehicle_no', nextVehicleNo)
        setField('vehicle_category_id', nextVehicleCategoryId)
        setField('vehicle_size_id', nextVehicleSizeId)
        setField('vehicle_kpl', nextVehicleKpl)

        if (driverOptions.length === 1) {
            setField('driver_id', driverOptions[0].value)
        } else if (!driverOptions.some((option) => option.value === form.driver_id)) {
            setField('driver_id', '')
        }

        if (helperOptions.length === 1) {
            setField('helper_id', helperOptions[0].value)
        } else if (!helperOptions.some((option) => option.value === form.helper_id)) {
            setField('helper_id', '')
        }

        if (supervisorOptions.length === 1) {
            setField('supervisor_id', supervisorOptions[0].value)
        } else if (!supervisorOptions.some((option) => option.value === form.supervisor_id)) {
            setField('supervisor_id', '')
        }
    }

    function applyVendorVehicleSelection(nextVehicle?: RentVehicle | null) {
        if (!nextVehicle) return

        const nextVehicleNo = toStringValue(nextVehicle.registration_number)
        const nextVehicleCategoryId = toStringValue(nextVehicle.vehicle_category_id ?? nextVehicle.vehicle_category?.id)
        const nextVehicleSizeId = toStringValue(nextVehicle.vehicle_size_id ?? nextVehicle.vehicle_size?.id)
        const driverOptions = getVendorVehicleDriverOptions(nextVehicle)
        const nextDriverName = toStringValue(nextVehicle.driver_name || nextVehicle.driver?.name || nextVehicle.vendor_driver?.name)

        setField('vehicle_no', nextVehicleNo)
        setField('vehicle_category_id', nextVehicleCategoryId)
        setField('vehicle_size_id', nextVehicleSizeId)
        setField('vehicle_kpl', '')
        setField('driver_name', nextDriverName)

        if (driverOptions.length === 1) {
            setField('driver_id', driverOptions[0].value)
        } else if (!driverOptions.some((option) => option.value === form.driver_id)) {
            setField('driver_id', '')
        }

        setField('helper_id', '')
    }

    function handleCustomerChange(nextCustomerId: string) {
        setField('customer_id', nextCustomerId)
        setField('load_area_id', '')
        const matchedCustomer = availableCustomers.find((item) => String(item.id) === nextCustomerId) || null
        setSelectedCustomer(matchedCustomer)
    }

    function handleVendorChange(nextVendorId: string) {
        setField('vendor_id', nextVendorId)
        setField('vehicle_id', '')
        setField('rent_vehicle_id', '')
        setField('driver_name', '')
        setField('driver_id', '')
        setField('helper_id', '')
        setField('vehicle_category_id', '')
        setField('vehicle_size_id', '')
        setField('vehicle_kpl', '')
        setField('vehicle_no', '')
        setField('supervisor_id', '')
        setSelectedVendorVehicle(null)
    }

    async function handleOwnVehicleChange(nextVehicleId: string) {
        setField('vehicle_id', nextVehicleId)
        const nextVehicle = vehicles.find((item) => String(item.id) === nextVehicleId) || null
        setSelectedOwnVehicle(nextVehicle)
        applyOwnVehicleSelection(nextVehicle)

        // Fetch last odometer reading for this vehicle
        if (nextVehicleId && isOwnTransport) {
            try {
                const res = await getLastOdometerReadingAction(tenantSlug, nextVehicleId)
                if (res.success && res.data) {
                    setLastOdometerReading({
                        has_reading: res.data.has_last_reading,
                        odometer_start_km: res.data.odometer_start_km,
                        last_trip: res.data.last_trip,
                    })

                    // Auto-fill odometer start if there's a last reading
                    if (res.data.has_last_reading && res.data.odometer_start_km !== null) {
                        setField('odometer_start_km', String(res.data.odometer_start_km))
                        toast.success(`Odometer start set to ${res.data.odometer_start_km} km (from last trip)`)
                    }
                }
            } catch (error) {
                console.error('[TripForm] Failed to fetch last odometer reading:', error)
                // Don't show error to user, just log it
            }
        } else {
            setLastOdometerReading(null)
        }
    }

    function handleRentVehicleChange(nextVehicleId: string) {
        setField('rent_vehicle_id', nextVehicleId)
        const nextVehicle = rentVehicles.find((item) => String(item.id) === nextVehicleId) || null
        setSelectedVendorVehicle(nextVehicle)
        applyVendorVehicleSelection(nextVehicle)
    }

    async function handleCreateUnloadPoint(areaName: string): Promise<boolean> {
        const trimmedName = areaName.trim()
        if (!trimmedName) return false

        try {
            const res = await createAreaClient(tenantSlug, { name: trimmedName })
            if (!res.success || !res.data) {
                toast.error(res.message || 'Failed to create area')
                return false
            }

            const createdArea = Array.isArray(res.data) ? res.data[0] : res.data
            if (!createdArea || typeof createdArea !== 'object' || !('id' in createdArea)) {
                toast.error(res.message || 'Failed to create area')
                return false
            }

            const createdId = String((createdArea as { id: number | string }).id)
            const createdLabel = String((createdArea as { name?: string }).name || trimmedName)
            const newArea = { id: Number(createdId), name: createdLabel }

            setAvailableUnloadAreas((prev) => (
                prev.some((item) => String(item.id) === createdId)
                    ? prev
                    : [...prev, newArea]
            ))

            // Also add to search results if currently searching
            setUnloadAreaSearchResults((prev) => (
                prev.some((item) => String(item.id) === createdId)
                    ? prev
                    : [...prev, newArea]
            ))

            setField('unload_area_id', createdId)
            setUnloadAreaSearch('') // Clear search after creation
            toast.success(res.message || 'Area created successfully')
            return true
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
            return false
        }
    }

    async function handleCreateCustomer(customerName: string): Promise<boolean> {
        const trimmedName = customerName.trim()
        if (!trimmedName) return false

        try {
            // Generate random 10-digit mobile number
            const randomMobile = Math.floor(1000000000 + Math.random() * 9000000000).toString()

            const res = await createCustomerClient(tenantSlug, {
                name: trimmedName,
                mobile: randomMobile,
                address: [],
                rate_status: 'fixed',
                status: 1,
            })
            if (!res.success || !res.data) {
                toast.error(res.message || 'Failed to create customer')
                return false
            }

            const createdCustomer = Array.isArray(res.data) ? res.data[0] : res.data
            if (!createdCustomer || typeof createdCustomer !== 'object' || !('id' in createdCustomer)) {
                toast.error(res.message || 'Failed to create customer')
                return false
            }

            const createdId = String((createdCustomer as { id: number | string }).id)
            setAvailableCustomers((prev) => (
                prev.some((item) => String(item.id) === createdId)
                    ? prev
                    : [...prev, createdCustomer as Customer]
            ))
            setField('customer_id', createdId)
            toast.success(res.message || 'Customer created successfully')
            return true
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
            return false
        }
    }

    async function handleCreateOffice(branchName: string): Promise<boolean> {
        const trimmedName = branchName.trim()
        if (!trimmedName) return false

        try {
            const formData = new FormData()
            formData.append('branch_name', trimmedName)
            formData.append('opening_balance', '0')
            formData.append('address', 'Default Address')
            formData.append('status', '1')

            const res = await createOfficeClient(tenantSlug, formData)
            if (!res.success || !res.data) {
                toast.error(res.message || 'Failed to create branch')
                return false
            }

            const createdOffice = Array.isArray(res.data) ? res.data[0] : res.data
            if (!createdOffice || typeof createdOffice !== 'object' || !('id' in createdOffice)) {
                toast.error(res.message || 'Failed to create branch')
                return false
            }

            const createdId = String((createdOffice as { id: number | string }).id)
            setAvailableOffices((prev) => (
                prev.some((item) => String(item.id) === createdId)
                    ? prev
                    : [...prev, createdOffice as Office]
            ))
            setField('office_id', createdId)
            toast.success(res.message || 'Branch created successfully')
            return true
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
            return false
        }
    }

    async function handleCreateLoadPoint(addressName: string): Promise<boolean> {
        const trimmedName = addressName.trim()
        if (!trimmedName) return false

        // Check if customer is selected
        const currentCustomerId = form.customer_id.trim()
        if (!currentCustomerId) {
            toast.error('Please select a customer first')
            return false
        }

        try {
            const res = await addCustomerAddressClient(tenantSlug, currentCustomerId, {
                name: trimmedName,
                address: trimmedName,
                status: 1,
            })
            if (!res.success || !res.data) {
                toast.error(res.message || 'Failed to create load point')
                return false
            }

            const createdAddress = Array.isArray(res.data) ? res.data[0] : res.data
            if (!createdAddress || typeof createdAddress !== 'object' || !('id' in createdAddress)) {
                toast.error(res.message || 'Failed to create load point')
                return false
            }

            const createdId = String((createdAddress as { id: number | string }).id)

            // Refresh customer data to get updated addresses
            const customerRes = await getCustomerAction(tenantSlug, currentCustomerId)
            if (customerRes.success && customerRes.data) {
                setSelectedCustomer(customerRes.data)
            }

            setField('load_area_id', createdId)
            toast.success(res.message || 'Load point created successfully')
            return true
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
            return false
        }
    }

    async function handleCreateSupplier(supplierName: string): Promise<boolean> {
        const trimmedName = supplierName.trim()
        if (!trimmedName) return false

        try {
            // Generate random 10-digit mobile number
            const randomMobile = Math.floor(1000000000 + Math.random() * 9000000000).toString()

            const formData = new FormData()
            formData.append('name', trimmedName)
            formData.append('business_category', 'Fuel Supplier')
            formData.append('mobile', randomMobile)
            formData.append('address', 'Default Address')
            formData.append('opening_balance', '0')
            formData.append('contact_person', trimmedName)
            formData.append('status', '1')

            const res = await createSupplierClient(tenantSlug, formData)
            if (!res.success || !res.data) {
                toast.error(res.message || 'Failed to create supplier')
                return false
            }

            const createdSupplier = Array.isArray(res.data) ? res.data[0] : res.data
            if (!createdSupplier || typeof createdSupplier !== 'object' || !('id' in createdSupplier)) {
                toast.error(res.message || 'Failed to create supplier')
                return false
            }

            const createdId = String((createdSupplier as { id: number | string }).id)
            setAvailableSuppliers((prev) => (
                prev.some((item) => String(item.id) === createdId)
                    ? prev
                    : [...prev, createdSupplier as Supplier]
            ))
            setField('fuel_supplier_id', createdId)
            toast.success(res.message || 'Supplier created successfully')
            return true
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Server error'
            toast.error(message)
            return false
        }
    }

    function ensure(value: string, message: string): boolean {
        if (value.trim()) return true
        toast.error(message)
        return false
    }

    function numericFieldValue(value: string): string {
        return value.trim() || '0'
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!ensure(form.date, 'Date is required')) return
        if (!ensure(form.customer_id, 'Customer is required')) return
        if (!ensure(form.office_id, 'Branch is required')) return
        if (!ensure(form.load_area_id, 'Load point is required')) return
        if (!ensure(form.unload_area_id, 'Unload point is required')) return
        if (!ensure(form.transport_type, 'Transport type is required')) return
        if (!ensure(form.vehicle_no, 'Vehicle no is required')) return
        if (!ensure(form.challan_no, 'Challan no is required')) return
        if (!ensure(form.total_rent_bill_amount, 'Total rent/bill amount is required')) return

        if (isOwnTransport) {
            if (!ensure(form.driver_id, 'Driver is required')) return
            if (!ensure(form.vehicle_id, 'Vehicle is required for own transport')) return
            if (!ensure(form.odometer_start_km, 'Odometer start is required for own transport')) return
            if (!ensure(form.odometer_end_km, 'Odometer end is required for own transport')) return
            if (toNumberValue(form.odometer_end_km) <= toNumberValue(form.odometer_start_km)) {
                toast.error('Odometer end must be greater than start')
                return
            }
            if (!ensure(form.vehicle_category_id, 'Vehicle category is required')) return
            if (!ensure(form.vehicle_size_id, 'Vehicle size is required')) return
            if (!ensure(form.vehicle_kpl, 'Vehicle KPL is required')) return
            if (!ensure(form.fuel_supplier_id, 'Supplier is required for own transport')) return
            if (!ensure(form.fuel_type, 'Oil type is required for own transport')) return
            if (!ensure(form.fuel_cost_per_liter, 'Fuel cost per liter is required')) return
        }

        if (isVendorTransport) {
            if (!ensure(form.driver_name, 'Driver name is required')) return
            if (!ensure(form.vendor_id, 'Vendor is required for vendor transport')) return
            if (!ensure(form.rent_vehicle_id, 'Vehicle is required for vendor transport')) return
            if (!ensure(form.vehicle_category_id, 'Vehicle category is required')) return
            if (!ensure(form.vehicle_size_id, 'Vehicle size is required')) return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('date', form.date.trim())
            formData.append('customer_id', form.customer_id)
            formData.append('office_id', form.office_id)
            formData.append('load_area_id', form.load_area_id)
            formData.append('unload_area_id', form.unload_area_id)
            formData.append('trip_type', form.trip_type.trim())
            formData.append('additional_unload_point', form.additional_unload_point.trim())
            formData.append('sender_name', form.sender_name.trim())
            formData.append('product_details', form.product_details.trim())
            formData.append('transport_type', form.transport_type.trim())
            if (isVendorTransport) {
                formData.append('vendor_id', form.vendor_id.trim())
                formData.append('rent_vehicle_id', form.rent_vehicle_id.trim())
            }
            if (isOwnTransport) {
                formData.append('vehicle_id', form.vehicle_id.trim())
            }
            formData.append('vehicle_no', form.vehicle_no.trim())
            if (isVendorTransport) {
                formData.append('driver_name', form.driver_name.trim())
            }
            if (isOwnTransport) {
                formData.append('driver_id', form.driver_id.trim())
            }
            if (isOwnTransport) {
                formData.append('helper_id', form.helper_id.trim())
                formData.append('supervisor_id', form.supervisor_id.trim())
                formData.append('vehicle_category_id', form.vehicle_category_id.trim())
                formData.append('vehicle_size_id', form.vehicle_size_id.trim())
                formData.append('vehicle_kpl', form.vehicle_kpl.trim())
            }
            if (isVendorTransport) {
                formData.append('vehicle_category_id', form.vehicle_category_id.trim())
                formData.append('vehicle_size_id', form.vehicle_size_id.trim())
            }
            formData.append('challan_no', form.challan_no.trim())
            formData.append('total_rent_bill_amount', numericFieldValue(form.total_rent_bill_amount))
            formData.append('odometer_start_km', numericFieldValue(form.odometer_start_km))
            formData.append('odometer_end_km', numericFieldValue(form.odometer_end_km))
            formData.append('running_km', numericFieldValue(form.running_km))
            formData.append('fuel_quantity_liter', numericFieldValue(form.fuel_quantity_liter))
            formData.append('fuel_cost_per_liter', numericFieldValue(form.fuel_cost_per_liter))
            formData.append('fuel_supplier_id', form.fuel_supplier_id.trim())
            formData.append('fuel_type', form.fuel_type.trim())
            formData.append('demurrage_days', numericFieldValue(form.demurrage_days))
            formData.append('total_demurrage', numericFieldValue(form.total_demurrage))
            formData.append('demurrage_total_rent', numericFieldValue(form.demurrage_total_rent))
            formData.append('vendor_demurrage_days', numericFieldValue(form.vendor_demurrage_days))
            formData.append('vendor_total_demurrage', numericFieldValue(form.vendor_total_demurrage))
            formData.append('vendor_rent', numericFieldValue(form.vendor_rent))
            formData.append('vendor_rent_demurrage_total', numericFieldValue(vendorRentDemurrageText))
            formData.append('rent_advance', numericFieldValue(form.rent_advance))
            formData.append('advance', numericFieldValue(form.advance))
            formData.append('due_amount', numericFieldValue(rentDueAmountText))
            formData.append('driver_advance', numericFieldValue(form.driver_advance))
            formData.append('driver_commission_percent', numericFieldValue(form.driver_commission_percent))
            formData.append('driver_commission_amount', numericFieldValue(form.driver_commission_amount))
            formData.append('fuel_cost', numericFieldValue(form.fuel_cost))
            formData.append('labour_cost', numericFieldValue(form.labour_cost))
            formData.append('toll_cost', numericFieldValue(form.toll_cost))
            formData.append('ferry_cost', numericFieldValue(form.ferry_cost))
            formData.append('police_cost', numericFieldValue(form.police_cost))
            formData.append('chada_cost', numericFieldValue(form.chada_cost))
            formData.append('parking_cost', numericFieldValue(form.parking_cost))
            formData.append('challan_cost', numericFieldValue(form.challan_cost))
            formData.append('food_cost', numericFieldValue(form.food_cost))
            formData.append('others_cost', numericFieldValue(form.others_cost))
            formData.append('night_guard', numericFieldValue(form.night_guard))
            formData.append('additional_load_cost', numericFieldValue(form.additional_load_cost))
            formData.append('total_expense', numericFieldValue(form.total_expense))
            formData.append('remarks', form.remarks.trim())
            formData.append('status', form.status)

            const res = tripId
                ? await updateTripClient(tenantSlug, tripId, formData)
                : await createTripClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Trip saved successfully')
                router.push(`/${tenantSlug}/trips`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save trip')
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
                <h2 className="text-xl font-bold text-slate-900">{submitLabel}</h2>
                <p className="mt-1 text-sm text-slate-600">Fill in trip details and save.</p>
            </div>

            <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                <h3 className="text-lg font-semibold text-slate-900">Trip & Destination</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <DateInput label="Date" name="date" value={form.date} onChange={(v) => setField('date', v)} required />
                    <SearchableSelect
                        label="Customer"
                        name="customer_id"
                        value={form.customer_id}
                        options={customerOptions}
                        onChange={(v) => handleCustomerChange(String(v))}
                        onCreateWhenEmpty={handleCreateCustomer}
                        placeholder="Select Customer"
                        required
                    />
                    <SearchableSelect
                        label="Branch"
                        name="office_id"
                        value={form.office_id}
                        options={officeOptions}
                        onChange={(v) => setField('office_id', String(v))}
                        onCreateWhenEmpty={handleCreateOffice}
                        placeholder="Select Branch"
                        required
                    />
                    <SearchableSelect
                        label="Load Point"
                        name="load_area_id"
                        value={form.load_area_id}
                        options={loadPointOptions}
                        onChange={(v) => setField('load_area_id', String(v))}
                        onCreateWhenEmpty={handleCreateLoadPoint}
                        placeholder={form.customer_id ? 'Select Load Point' : 'Select customer first'}
                        required
                    />
                    <AreaSearchSelect
                        label="Unload Point"
                        name="unload_area_id"
                        value={form.unload_area_id}
                        options={unloadPointOptions}
                        onChange={(v) => setField('unload_area_id', String(v))}
                        onCreateArea={handleCreateUnloadPoint}
                        onSearch={setUnloadAreaSearch}
                        searching={unloadAreaSearching}
                        placeholder="Select Unload Point"
                        required
                    />
                    <SearchableSelect
                        label="Trip Type"
                        name="trip_type"
                        value={form.trip_type}
                        options={TRIP_TYPE_OPTIONS}
                        onChange={(v) => setField('trip_type', String(v))}
                        placeholder="Select Trip Type"
                        required
                    />
                    <TextInput
                        label="Additional Unload Point"
                        name="additional_unload_point"
                        value={form.additional_unload_point}
                        onChange={(v) => setField('additional_unload_point', v)}
                        placeholder="Additional Unload Point"
                    />
                    <TextInput
                        label="Sender's Name"
                        name="sender_name"
                        value={form.sender_name}
                        onChange={(v) => setField('sender_name', v)}
                        placeholder="Enter sender name"
                    />
                </div>
                <TextInput
                    label="Product Details"
                    name="product_details"
                    value={form.product_details}
                    onChange={(v) => setField('product_details', v)}
                    placeholder="Product details"
                    textarea
                    rows={3}
                />
            </section>

            <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                <h3 className="text-lg font-semibold text-slate-900">Vehicle & Driver Information</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <SearchableSelect
                        label="Transport Type"
                        name="transport_type"
                        value={form.transport_type}
                        options={TRANSPORT_TYPE_OPTIONS}
                        onChange={(v) => setField('transport_type', String(v))}
                        placeholder="Select Transport Type"
                        required
                    />
                    {isVendorTransport && (
                        <SearchableSelect
                            label="Vendor Name"
                            name="vendor_id"
                            value={form.vendor_id}
                            options={vendorOptions}
                            onChange={(v) => handleVendorChange(String(v))}
                            placeholder="Select Vendor"
                            required
                        />
                    )}
                    {isOwnTransport && (
                        <SearchableSelect
                            label="Vehicle"
                            name="vehicle_id"
                            value={form.vehicle_id}
                            options={mergedOwnVehicleOptions}
                            onChange={(v) => handleOwnVehicleChange(String(v))}
                            placeholder="Select Vehicle"
                            required
                        />
                    )}
                    {isVendorTransport && (
                        <SearchableSelect
                            label="Vehicle"
                            name="rent_vehicle_id"
                            value={form.rent_vehicle_id}
                            options={mergedVendorVehicleOptions}
                            onChange={(v) => handleRentVehicleChange(String(v))}
                            placeholder="Select Vehicle"
                            required
                        />
                    )}
                    <TextInput
                        label="Challan No"
                        name="challan_no"
                        value={form.challan_no}
                        onChange={(v) => setField('challan_no', v)}
                        placeholder="Challan No"
                        required={!isEditMode}
                        // readOnly={!isEditMode && form.challan_no !== ''}
                        helpText={!isEditMode && form.challan_no !== '' ? 'Auto-generated from date' : undefined}
                    />
                    <TextInput
                        label="Total Rent/Bill Amount"
                        name="total_rent_bill_amount"
                        value={form.total_rent_bill_amount}
                        onChange={(v) => setField('total_rent_bill_amount', v)}
                        placeholder="Total Rent/Bill Amount"
                        type="number"
                        required
                    />
                    <TextInput
                        label="Rent Advance"
                        name="rent_advance"
                        value={form.rent_advance}
                        onChange={(v) => setField('rent_advance', v)}
                        placeholder="Rent Advance"
                        type="number"
                    />
                    <TextInput
                        label="Due Amount"
                        name="due_amount"
                        value={rentDueAmountText}
                        onChange={() => {}}
                        placeholder="Due Amount"
                        type="number"
                        readOnly
                    />
                </div>

                {activeVehicle && (
                    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                            Selected Vehicle Details
                        </h4>
                        <div className="grid gap-4 md:grid-cols-3">
                            {isOwnTransport ? (
                                <SearchableSelect
                                    label="Driver Name"
                                    name="driver_id"
                                    value={form.driver_id}
                                    options={activeVehicleDriverOptions}
                                    onChange={(v) => setField('driver_id', String(v))}
                                    placeholder="Select Driver"
                                    required
                                />
                            ) : (
                                <TextInput
                                    label="Driver Name"
                                    name="driver_name"
                                    value={activeVendorDriverName || form.driver_name}
                                    onChange={() => {}}
                                    placeholder="Driver Name"
                                    readOnly
                                />
                            )}
                            {isOwnTransport && (
                                <SearchableSelect
                                    label="Helper Name"
                                    name="helper_id"
                                    value={form.helper_id}
                                    options={activeVehicleHelperOptions}
                                    onChange={(v) => setField('helper_id', String(v))}
                                    placeholder="Select Helper"
                                />
                            )}
                            {isOwnTransport && (
                                <SearchableSelect
                                    label="Supervisor"
                                    name="supervisor_id"
                                    value={form.supervisor_id}
                                    options={activeVehicleSupervisorOptions}
                                    onChange={(v) => setField('supervisor_id', String(v))}
                                    placeholder="Select Supervisor"
                                />
                            )}
                            <TextInput
                                label="Vehicle Category"
                                name="vehicle_category_display"
                                value={activeVehicleCategoryName}
                                onChange={() => {}}
                                readOnly
                            />
                            <TextInput
                                label="Vehicle Size"
                                name="vehicle_size_display"
                                value={activeVehicleSizeName}
                                onChange={() => {}}
                                readOnly
                            />
                            {isOwnTransport && (
                                <TextInput
                                    label="Vehicle KPL"
                                    name="vehicle_kpl_display"
                                    value={activeOwnVehicleKpl}
                                    onChange={() => {}}
                                    type="number"
                                    readOnly
                                />
                            )}
                        </div>
                    </div>
                )}
            </section>

            {isOwnTransport && (
                <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">Fuel Intelligence</h3>
                    </div>

                    {actualDistanceValue > 0 && (
                        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                            <p className="text-sm font-medium text-blue-900">📍 Distance Information</p>
                            <p className="mt-1 text-sm text-blue-700">
                                <span className="font-semibold">{actualDistanceValue.toFixed(2)} KM</span>
                                {odometerDistance > 0 ? (
                                    <span className="ml-2 text-xs text-blue-600">(from odometer readings)</span>
                                ) : routeDistanceSource === 'google_maps' ? (
                                    <span className="ml-2 text-xs text-blue-600">(via Google Maps)</span>
                                ) : routeDistanceSource === 'route_pricing' ? (
                                    <span className="ml-2 text-xs text-blue-600">(from route pricing)</span>
                                ) : null}
                                {actualFuelQuantityValue > 0 && (
                                    <>
                                        <br />
                                        Actual Fuel Quantity: <span className="font-semibold">{actualFuelQuantityValue.toFixed(2)} L</span>
                                        <span className="ml-2 text-xs text-blue-600">({vehicleKplValue.toFixed(1)} KM/L)</span>
                                    </>
                                )}
                            </p>
                        </div>
                    )}

                    {calculatingDistance && (
                        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                            <p className="text-sm font-medium text-yellow-900">⏳ Calculating Distance...</p>
                            <p className="mt-1 text-sm text-yellow-700">
                                Using Google Maps to calculate distance between load and unload points.
                            </p>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-3">
                        <TextInput
                            label="Odometer Start (KM)"
                            name="odometer_start_km"
                            value={form.odometer_start_km}
                            onChange={(v) => setField('odometer_start_km', v)}
                            placeholder="Odometer Start (KM)"
                            type="number"
                            required
                            helpText={
                                lastOdometerReading?.has_reading && lastOdometerReading.last_trip
                                    ? `Auto-filled from last trip (${lastOdometerReading.last_trip.date}, Challan: ${lastOdometerReading.last_trip.challan_no}, End: ${lastOdometerReading.last_trip.odometer_end_km} km)`
                                    : 'Enter starting odometer reading'
                            }
                        />
                        <TextInput
                            label="Odometer End (KM)"
                            name="odometer_end_km"
                            value={form.odometer_end_km}
                            onChange={handleOdometerEndChange}
                            placeholder="Odometer End (KM)"
                            type="number"
                            helpText="Auto-calculated from fuel cost, or enter manually"
                        />
                        <TextInput
                            label="Running Distance (KM)"
                            name="running_km"
                            value={form.running_km}
                            onChange={() => {}}
                            placeholder="Running Distance (KM)"
                            type="number"
                            readOnly
                            helpText="Auto-calculated from odometer readings or fuel cost"
                        />
                        <TextInput label="Vehicle KPL" name="vehicle_kpl" value={form.vehicle_kpl} onChange={() => {}} placeholder="Vehicle KPL" type="number" readOnly />
                        <TextInput
                            label="Actual Fuel Quantity (Liter)"
                            name="fuel_quantity_liter"
                            value={form.fuel_quantity_liter}
                            onChange={() => {}}
                            placeholder="Actual Fuel Quantity (Liter)"
                            type="number"
                            readOnly
                            helpText={routeDistance ? "Based on route distance" : "Based on odometer readings or fuel cost"}
                        />
                        <TextInput
                            label="Fuel Cost Per Liter (BDT)"
                            name="fuel_cost_per_liter"
                            value={form.fuel_cost_per_liter}
                            onChange={(v) => setField('fuel_cost_per_liter', v)}
                            placeholder="Fuel Cost Per Liter (BDT)"
                            type="number"
                            required
                            helpText="Required for fuel cost calculation"
                        />
                        <TextInput
                            label="Fuel Cost"
                            name="fuel_cost"
                            value={form.fuel_cost}
                            onChange={handleFuelCostChange}
                            placeholder="Fuel Cost"
                            type="number"
                            helpText="Auto-calculated from odometer, or enter manually to calculate odometer end"
                        />

                        <SearchableSelect
                            label="Supplier"
                            name="fuel_supplier_id"
                            value={form.fuel_supplier_id}
                            options={supplierOptions}
                            onChange={(v) => setField('fuel_supplier_id', String(v))}
                            onCreateWhenEmpty={handleCreateSupplier}
                            placeholder="Select Supplier"
                            required={isOwnTransport}
                        />
                        <SearchableSelect
                            label="Oil Type"
                            name="fuel_type"
                            value={form.fuel_type}
                            options={FUEL_TYPE_OPTIONS}
                            onChange={(v) => setField('fuel_type', String(v))}
                            placeholder="Select Oil Type"
                            required={isOwnTransport}
                        />
                    </div>
                </section>
            )}

            <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                <h3 className="text-lg font-semibold text-slate-900">Customer Demurrage</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <TextInput label="Demurrage Days" name="demurrage_days" value={form.demurrage_days} onChange={(v) => setField('demurrage_days', v)} placeholder="Demurrage Days" type="number" />
                    <TextInput label="Total Demurrage" name="total_demurrage" value={form.total_demurrage} onChange={(v) => setField('total_demurrage', v)} placeholder="Total Demurrage" type="number" />
                    <TextInput label="Demurrage + Total Rent" name="demurrage_total_rent" value={form.demurrage_total_rent} onChange={() => {}} placeholder="Demurrage + Total Rent" type="number" readOnly />
                </div>
            </section>

            {isVendorTransport && (
                <>
                    <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                        <h3 className="text-lg font-semibold text-slate-900">Vendor Demurrage</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            <TextInput label="Demurrage Days" name="vendor_demurrage_days" value={form.vendor_demurrage_days} onChange={(v) => setField('vendor_demurrage_days', v)} placeholder="Demurrage Days" type="number" />
                            <TextInput label="Total Demurrage" name="vendor_total_demurrage" value={form.vendor_total_demurrage} onChange={(v) => setField('vendor_total_demurrage', v)} placeholder="Total Demurrage" type="number" />
                            <TextInput label="Vendor Rent" name="vendor_rent" value={form.vendor_rent} onChange={(v) => setField('vendor_rent', v)} placeholder="Vendor Rent" type="number" />
                        </div>
                    </section>

                    <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                        <h3 className="text-lg font-semibold text-slate-900">Vendor Payment Details</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            <TextInput label="Vendor Rent + Demurrage" name="vendor_rent_demurrage_total" value={vendorRentDemurrageText} onChange={() => {}} placeholder="Vendor Rent + Demurrage" type="number" readOnly />
                            <TextInput label="Vendor Advance" name="advance" value={form.advance} onChange={(v) => setField('advance', v)} placeholder="Vendor Advance" type="number" />
                            <TextInput label="Vendor Due Amount" name="vendor_due_amount" value={vendorAdvanceDueText} onChange={() => {}} placeholder="Vendor Due Amount" type="number" readOnly />
                        </div>
                    </section>
                </>
            )}

            {isOwnTransport && (
                <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                    <h3 className="text-lg font-semibold text-slate-900">Expense Details</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                        <TextInput label="Driver Advance" name="driver_advance" value={form.driver_advance} onChange={(v) => setField('driver_advance', v)} placeholder="Driver Advance" type="number" />
                        <TextInput label="Driver Commission (%)" name="driver_commission_percent" value={form.driver_commission_percent} onChange={(v) => setField('driver_commission_percent', v)} placeholder="Driver Commission (%)" type="number" />
                        <TextInput label="Driver Commission (Amount)" name="driver_commission_amount" value={form.driver_commission_amount} onChange={() => {}} placeholder="Driver Commission (Amount)" type="number" readOnly />
                        <TextInput label="Labour Cost" name="labour_cost" value={form.labour_cost} onChange={(v) => setField('labour_cost', v)} placeholder="Labour Cost" type="number" />
                        <TextInput label="Toll Cost" name="toll_cost" value={form.toll_cost} onChange={(v) => setField('toll_cost', v)} placeholder="Toll Cost" type="number" />
                        <TextInput label="Ferry Cost" name="ferry_cost" value={form.ferry_cost} onChange={(v) => setField('ferry_cost', v)} placeholder="Ferry Cost" type="number" />
                        <TextInput label="Police Cost" name="police_cost" value={form.police_cost} onChange={(v) => setField('police_cost', v)} placeholder="Police Cost" type="number" />
                        <TextInput label="Chada Cost" name="chada_cost" value={form.chada_cost} onChange={(v) => setField('chada_cost', v)} placeholder="Chada Cost" type="number" />
                        <TextInput label="Parking Cost" name="parking_cost" value={form.parking_cost} onChange={(v) => setField('parking_cost', v)} placeholder="Parking Cost" type="number" />
                        <TextInput label="Challan Cost" name="challan_cost" value={form.challan_cost} onChange={(v) => setField('challan_cost', v)} placeholder="Challan Cost" type="number" />
                        <TextInput label="Food Cost" name="food_cost" value={form.food_cost} onChange={(v) => setField('food_cost', v)} placeholder="Food Cost" type="number" />
                        <TextInput label="Others Cost" name="others_cost" value={form.others_cost} onChange={(v) => setField('others_cost', v)} placeholder="Others Cost" type="number" />
                        <TextInput label="Night Guard" name="night_guard" value={form.night_guard} onChange={(v) => setField('night_guard', v)} placeholder="Night Guard" type="number" />
                        <TextInput label="Additional Load Cost" name="additional_load_cost" value={form.additional_load_cost} onChange={(v) => setField('additional_load_cost', v)} placeholder="Additional Load Cost" type="number" />
                        <TextInput label="Total Expense" name="total_expense" value={form.total_expense} onChange={() => {}} placeholder="Total Expense" type="number" readOnly />
                    </div>
                </section>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                    label="Remarks"
                    name="remarks"
                    value={form.remarks}
                    onChange={(v) => setField('remarks', v)}
                    placeholder="Remarks"
                    textarea
                    rows={3}
                />
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                >
                    {loading ? 'Saving...' : submitLabel}
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${tenantSlug}/trips`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}