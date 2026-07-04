'use client'

import { useEffect, useMemo, useState } from 'react'
import { getCustomersAction } from '@/features/customers/actions/customer.actions'
import type { Customer } from '@/features/customers/types'
import {Driver, getDriversAction} from '@/features/drivers'
import { getOfficesAction, Office } from '@/features/offices'
import { getRentVehiclesAction, RentVehicle } from '@/features/rent-vehicles'
import { getVehiclesAction, type Vehicle } from '@/features/vehicles'
import { getVendorsAction, type Vendor } from '@/features/vendors'

type Option = {
    value: string
    label: string
}

export function useTripListLookups(tenantSlug: string) {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [offices, setOffices] = useState<Office[]>([])
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [rentVehicles, setRentVehicles] = useState<RentVehicle[]>([])
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [drivers, setDrivers] = useState<Driver[]>([])

    useEffect(() => {
        if (!tenantSlug) return

        let active = true

        void (async () => {
            const [customersRes, officesRes, vehiclesRes, rentVehiclesRes, vendorsRes, driversRes] = await Promise.all([
                getCustomersAction(tenantSlug, 1, ''),
                getOfficesAction(tenantSlug, 1, ''),
                getVehiclesAction(tenantSlug, 1, ''),
                getRentVehiclesAction(tenantSlug, 1, ''),
                getVendorsAction(tenantSlug, 1, ''),
                getDriversAction(tenantSlug, 1, ''),
            ])

            if (!active) return

            setCustomers(customersRes.success ? customersRes.data?.data || [] : [])
            setOffices(officesRes.success ? officesRes.data?.data || [] : [])
            setVehicles(vehiclesRes.success ? vehiclesRes.data?.data || [] : [])
            setRentVehicles(rentVehiclesRes.success ? rentVehiclesRes.data?.data || [] : [])
            setVendors(vendorsRes.success ? vendorsRes.data?.data || [] : [])
            setDrivers(driversRes.success ? driversRes.data?.data || [] : [])
        })()

        return () => {
            active = false
        }
    }, [tenantSlug])

    const customerOptions = useMemo<Option[]>(() => customers.map((customer) => ({
        value: String(customer.id),
        label: customer.name || `#${customer.id}`,
    })), [customers])

    const officeOptions = useMemo<Option[]>(() => offices.map((office) => ({
        value: String(office.id),
        label: office.branch_name,
    })), [offices])

    const ownVehicleOptions = useMemo<Option[]>(() => vehicles.map((vehicle) => ({
        value: String(vehicle.id),
        label: `${vehicle.vehicle_name || 'N/A'} (${vehicle.registration_no || vehicle.registration_number || 'N/A'})`,
    })), [vehicles])

    const rentVehicleOptions = useMemo<Option[]>(() => rentVehicles.map((vehicle) => ({
        value: String(vehicle.id),
        label: `${vehicle.vehicle_name || 'N/A'} (${vehicle.registration_number || 'N/A'})`,
    })), [rentVehicles])

    const vendorOptions = useMemo<Option[]>(() => vendors.map((vendor) => ({
        value: String(vendor.id),
        label: vendor.name || `#${vendor.id}`,
    })), [vendors])

    const driverOptions = useMemo<Option[]>(() => drivers.map((driver) => ({
        value: String(driver.id),
        label: driver.name || `#${driver.id}`,
    })), [drivers])

    return {
        customerOptions,
        officeOptions,
        ownVehicleOptions,
        rentVehicleOptions,
        vendorOptions,
        driverOptions,
    }
}
