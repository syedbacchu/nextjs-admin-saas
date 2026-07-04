'use client'

import SearchableSelect from '@/components/form/SearchableSelect'

interface AreaOption {
    label: string
    value: string | number
}

interface AreaSearchSelectProps {
    label: string
    name?: string
    value?: string | number
    options: AreaOption[]
    onChange: (value: string | number) => void
    onCreateArea: (name: string) => boolean | Promise<boolean>
    onSearch?: (search: string) => void
    placeholder?: string
    required?: boolean
    emptyStateText?: string
    createEmptyLabel?: string
    searching?: boolean
}

export default function AreaSearchSelect({
    label,
    name,
    value,
    options,
    onChange,
    onCreateArea,
    onSearch,
    placeholder = 'Select...',
    required,
    emptyStateText = 'No results found',
    createEmptyLabel = 'Create',
    searching = false,
}: AreaSearchSelectProps) {
    return (
        <SearchableSelect
            label={label}
            name={name}
            value={value}
            options={options}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            emptyStateText={searching ? 'Searching...' : emptyStateText}
            createEmptyLabel={createEmptyLabel}
            onCreateWhenEmpty={onCreateArea}
            onSearch={onSearch}
        />
    )
}
