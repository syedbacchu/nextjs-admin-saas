'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DateInput } from '@/components/form/DateInput'
import SelectInput from '@/components/form/SelectInput'
import TextInput from '@/components/form/TextInput'
import ImagePickerField from '@/components/form/ImagePickerField'
import {
    createOfficialProductPurchaseClient,
    updateOfficialProductPurchaseClient,
    OfficialProductPurchase
} from '@/features/official-product-purchases'
import type { Office } from '@/features/offices'
import type { Supplier } from '@/features/suppliers'
import type { Driver } from '@/features/drivers'
import type { FileSystemItem } from '@/features/files'

interface OfficialProductPurchaseFormProps {
    tenantSlug: string
    offices: Office[]
    suppliers: Supplier[]
    drivers: Driver[]
    initialFiles: FileSystemItem[]
    initialData?: Partial<OfficialProductPurchase>
    officialProductPurchaseId?: number | string
    submitLabel?: string
}

interface ItemState {
    item_name: string
    quantity: string
    unit_price: string
    total: string
}

const CATEGORY_OPTIONS = [
    { label: 'IT Product', value: 'it_product' },
    { label: 'Electrical', value: 'electrical' },
    { label: 'Stationary', value: 'stationary' },
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

function toStringValue(value: unknown): string {
    if (value === null || typeof value === 'undefined') return ''
    return String(value)
}

function calculateTotal(quantity: string, unitPrice: string): string {
    const q = Number(quantity)
    const p = Number(unitPrice)
    if (!Number.isFinite(q) || !Number.isFinite(p)) return ''
    return String(q * p)
}

export default function OfficialProductPurchaseForm({
    tenantSlug,
    offices,
    suppliers,
    drivers,
    initialFiles,
    initialData,
    officialProductPurchaseId,
    submitLabel = 'Save Official Product Purchase',
}: OfficialProductPurchaseFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const officeOptions = offices.map((office) => ({
        label: office.branch_name,
        value: String(office.id),
    }))
    const supplierOptions = suppliers.map((supplier) => ({
        label: `${supplier.name}${supplier.creation_type === 2 ? ' (Walk In Supplier)' : supplier.mobile ? ` (${supplier.mobile})` : ''}`,
        value: String(supplier.id),
    }))
    const driverOptions = drivers.map((driver) => ({
        label: `${driver.name}${driver.phone ? ` (${driver.phone})` : ''}`,
        value: String(driver.id),
    }))

    const [purchaseDate, setPurchaseDate] = useState(
        toDateInputValue(initialData?.purchase_date) || new Date().toISOString().slice(0, 10)
    )
    const [officeId, setOfficeId] = useState(toStringValue(initialData?.office_id ?? initialData?.office?.id))
    const [supplierId, setSupplierId] = useState(toStringValue(initialData?.supplier_id ?? initialData?.supplier?.id))
    const [driverId, setDriverId] = useState(toStringValue(initialData?.driver_id ?? initialData?.driver?.id))
    const [category, setCategory] = useState(toStringValue(initialData?.category))
    const [serviceCharge, setServiceCharge] = useState(toStringValue(initialData?.service_charge))
    const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(toStringValue(initialData?.total_purchase_amount))
    const [remarks, setRemarks] = useState(toStringValue(initialData?.remarks))
    const [priority, setPriority] = useState(toStringValue(initialData?.priority))
    const [status] = useState(initialData?.status === 0 ? '0' : '1')
    const [billDocumentUrl, setBillDocumentUrl] = useState(toStringValue(initialData?.bill_document))

    const initialItems = Array.isArray(initialData?.items) && initialData.items.length > 0
        ? initialData.items.map((item) => ({
            item_name: toStringValue(item.item_name),
            quantity: toStringValue(item.quantity),
            unit_price: toStringValue(item.unit_price),
            total: toStringValue(item.total),
        }))
        : [{ item_name: '', quantity: '', unit_price: '', total: '' }]
    const [items, setItems] = useState<ItemState[]>(initialItems)

    // Auto-calculate total purchase amount
    useEffect(() => {
        const serviceChargeNum = Number.parseFloat(serviceCharge) || 0
        const itemsTotal = items.reduce((sum, item) => {
            const itemTotal = Number.parseFloat(item.total) || 0
            return sum + itemTotal
        }, 0)
        const total = serviceChargeNum + itemsTotal
        setTotalPurchaseAmount(String(total))
    }, [serviceCharge, items])

    function addItem() {
        setItems((prev) => [...prev, { item_name: '', quantity: '', unit_price: '', total: '' }])
    }

    function removeItem(index: number) {
        setItems((prev) => {
            const next = prev.filter((_, idx) => idx !== index)
            return next.length ? next : [{ item_name: '', quantity: '', unit_price: '', total: '' }]
        })
    }

    function updateItem(index: number, key: keyof ItemState, value: string) {
        setItems((prev) =>
            prev.map((item, idx) => {
                if (idx !== index) return item
                const next = { ...item, [key]: value }
                if (key === 'quantity' || key === 'unit_price') {
                    next.total = calculateTotal(next.quantity, next.unit_price)
                }
                return next
            }),
        )
    }

    function validateItems(): boolean {
        for (let i = 0; i < items.length; i += 1) {
            const item = items[i]
            if (!item.item_name.trim()) {
                toast.error(`Item name is required for row ${i + 1}`)
                return false
            }
            if (!item.quantity.trim()) {
                toast.error(`Quantity is required for row ${i + 1}`)
                return false
            }
            if (!item.unit_price.trim()) {
                toast.error(`Unit price is required for row ${i + 1}`)
                return false
            }
        }
        return true
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!purchaseDate.trim()) {
            toast.error('Purchase date is required')
            return
        }
        if (!officeId.trim()) {
            toast.error('Branch is required')
            return
        }
        if (!supplierId.trim()) {
            toast.error('Supplier is required')
            return
        }
        if (!category.trim()) {
            toast.error('Category is required')
            return
        }
        if (!serviceCharge.trim()) {
            toast.error('Service charge is required')
            return
        }
        if (!totalPurchaseAmount.trim()) {
            toast.error('Total purchase amount is required')
            return
        }
        if (!validateItems()) return

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('purchase_date', purchaseDate.trim())
            formData.append('office_id', officeId)
            formData.append('supplier_id', supplierId)
            formData.append('driver_id', driverId.trim())
            formData.append('category', category.trim())
            formData.append('service_charge', serviceCharge.trim())
            formData.append('total_purchase_amount', totalPurchaseAmount.trim())
            formData.append('remarks', remarks.trim())
            formData.append('priority', priority.trim())
            formData.append('status', status)

            items.forEach((item, index) => {
                formData.append(`items[${index}][item_name]`, item.item_name.trim())
                formData.append(`items[${index}][quantity]`, item.quantity.trim())
                formData.append(`items[${index}][unit_price]`, item.unit_price.trim())
                formData.append(
                    `items[${index}][total]`,
                    (item.total.trim() || calculateTotal(item.quantity, item.unit_price)).trim(),
                )
            })

            if (billDocumentUrl) {
                formData.append('bill_document_url', billDocumentUrl.trim())
            }

            const res = officialProductPurchaseId
                ? await updateOfficialProductPurchaseClient(tenantSlug, officialProductPurchaseId, formData)
                : await createOfficialProductPurchaseClient(tenantSlug, formData)

            if (res.success) {
                toast.success(res.message || 'Official product purchase saved successfully')
                router.push(`/${tenantSlug}/official-product-purchases`)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save official product purchase')
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
                <p className="mt-1 text-sm text-slate-600">Fill in official product purchase details and save.</p>
            </div>

            <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                <h3 className="text-lg font-semibold text-slate-900">Official Product Purchase</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <DateInput label="Purchase Date" name="purchase_date" value={purchaseDate} onChange={setPurchaseDate} required />
                    <SelectInput
                        label="Branch Name"
                        name="office_id"
                        value={officeId}
                        options={officeOptions}
                        onChange={setOfficeId}
                        emptyOptionLabel="Branch Name"
                        required
                    />
                    <SelectInput
                        label="Supplier Name"
                        name="supplier_id"
                        value={supplierId}
                        options={supplierOptions}
                        onChange={setSupplierId}
                        emptyOptionLabel="Supplier Name"
                        required
                    />
                    <SelectInput
                        label="Category"
                        name="category"
                        value={category}
                        options={CATEGORY_OPTIONS}
                        onChange={setCategory}
                        emptyOptionLabel="Category"
                        required
                    />
                    <SelectInput
                        label="Driver Name"
                        name="driver_id"
                        value={driverId}
                        options={driverOptions}
                        onChange={setDriverId}
                        emptyOptionLabel="Driver Name"
                    />
                    <TextInput
                        label="Service Charge"
                        name="service_charge"
                        value={serviceCharge}
                        onChange={setServiceCharge}
                        placeholder="Service Charge Enter"
                        type="number"
                        required
                    />
                </div>
            </section>

            <section className="space-y-4 rounded-xl border border-slate-200 p-4">
                <h3 className="text-lg font-semibold text-slate-900">Items</h3>
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={`item-${index}`} className="rounded-lg border border-slate-200 p-3">
                            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                                <TextInput
                                    label="Item Name"
                                    name={`item_name_${index}`}
                                    value={item.item_name}
                                    onChange={(value) => updateItem(index, 'item_name', value)}
                                    placeholder="Item Name Enter"
                                    required
                                />
                                <TextInput
                                    label="Quantity"
                                    name={`quantity_${index}`}
                                    value={item.quantity}
                                    onChange={(value) => updateItem(index, 'quantity', value)}
                                    placeholder="Quantity Enter"
                                    type="number"
                                    required
                                />
                                <TextInput
                                    label="Unit Price"
                                    name={`unit_price_${index}`}
                                    value={item.unit_price}
                                    onChange={(value) => updateItem(index, 'unit_price', value)}
                                    placeholder="Unit Price Enter"
                                    type="number"
                                    required
                                />
                                <TextInput
                                    label="Total"
                                    name={`total_${index}`}
                                    value={item.total}
                                    onChange={(value) => updateItem(index, 'total', value)}
                                    placeholder="Total Enter"
                                    type="number"
                                />
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="rounded-md bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-600"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addItem}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                    + Add Item
                </button>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                    label="Total Purchase Amount"
                    name="total_purchase_amount"
                    value={totalPurchaseAmount}
                    onChange={setTotalPurchaseAmount}
                    placeholder="Total Purchase Amount Enter"
                    type="number"
                    readOnly
                />
                <TextInput
                    label="Priority"
                    name="priority"
                    value={priority}
                    onChange={setPriority}
                    placeholder="Priority Enter"
                />
                <TextInput
                    label="Remarks"
                    name="remarks"
                    value={remarks}
                    onChange={setRemarks}
                    placeholder="Remarks Enter"
                />
            </div>

            <ImagePickerField
                tenantSlug={tenantSlug}
                label="Bill Document"
                value={billDocumentUrl}
                onChange={setBillDocumentUrl}
                initialFiles={initialFiles}
                placeholder="Select bill document from file manager"
                previewAlt="Bill document preview"
                triggerLabel="Choose from File Manager"
                modalTitle="Bill Document Manager"
                modalDescription="Select a bill document from the file manager or upload a new file."
                uploadFieldName="bill_document"
            />

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
                    onClick={() => router.push(`/${tenantSlug}/official-product-purchases`)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
