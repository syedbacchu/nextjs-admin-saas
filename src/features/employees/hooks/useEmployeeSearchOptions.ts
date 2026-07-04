'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getAllEmployeesAction, Employee } from '@/features/employees'

type SelectOption = {
    label: string
    value: string
}

function mapEmployeeOptions(employees: Employee[]): SelectOption[] {
    return employees.map((employee) => {
        const typeCode =
            employee.employee_type === 'helper'
                ? 'H'
                : employee.employee_type === 'supervisor'
                  ? 'S'
                  : 'E'

        return {
            label: `${employee.name}${employee.mobile ? ` (${employee.mobile})` : ''} (${typeCode})`,
            value: String(employee.id),
        }
    })
}

function matchesEmployeeSearch(employee: Employee, search: string): boolean {
    const normalizedSearch = search.toLowerCase()
    const typeCode =
        employee.employee_type === 'helper'
            ? 'H'
            : employee.employee_type === 'supervisor'
              ? 'S'
              : 'E'

    return [
        employee.name,
        employee.mobile,
        employee.email,
        employee.designation,
        typeCode,
    ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch))
}

function ensureSelectedOption(
    options: SelectOption[],
    selectedValue?: string | number,
    fallbackOptions: SelectOption[] = [],
): SelectOption[] {
    if (!selectedValue) {
        return options
    }

    const selected = [...options, ...fallbackOptions].find(
        (option) => String(option.value) === String(selectedValue),
    )

    if (!selected) {
        return options
    }

    if (options.some((option) => String(option.value) === String(selectedValue))) {
        return options
    }

    return [selected, ...options]
}

export function useEmployeeSearchOptions(
    tenantSlug: string,
    employees: Employee[],
    selectedValue?: string | number,
) {
    const baseOptions = useMemo(() => mapEmployeeOptions(employees), [employees])
    const [employeeOptions, setEmployeeOptions] = useState(() =>
        ensureSelectedOption(baseOptions, selectedValue),
    )
    const requestIdRef = useRef(0)

    useEffect(() => {
        setEmployeeOptions(ensureSelectedOption(baseOptions, selectedValue))
    }, [baseOptions, selectedValue])

    const handleEmployeeSearch = useCallback(
        async (search: string) => {
            const trimmed = search.trim()

            if (!trimmed || trimmed.length < 3) {
                setEmployeeOptions(ensureSelectedOption(baseOptions, selectedValue))
                return
            }

            const requestId = ++requestIdRef.current
            const res = await getAllEmployeesAction(tenantSlug)

            if (requestId !== requestIdRef.current) {
                return
            }

            const nextEmployees =
                res.success && Array.isArray(res.data)
                    ? res.data.filter((employee) => matchesEmployeeSearch(employee, trimmed))
                    : []

            const nextOptions = mapEmployeeOptions(nextEmployees)
            setEmployeeOptions(
                ensureSelectedOption(nextOptions, selectedValue, baseOptions),
            )
        },
        [baseOptions, selectedValue, tenantSlug],
    )

    return {
        employeeOptions,
        handleEmployeeSearch,
    }
}
