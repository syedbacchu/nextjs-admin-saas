'use client'

import { dateRange } from '@/lib/validators'
import { DateInput } from './DateInput'

export default function DateRange({
                                      from,
                                      to,
                                      setFrom,
                                      setTo,
                                  }: any) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <DateInput label="From Date" value={from} onChange={setFrom} />
            <DateInput
                label="To Date"
                value={to}
                onChange={setTo}
                validators={[dateRange(from)]}
            />
        </div>
    )
}
