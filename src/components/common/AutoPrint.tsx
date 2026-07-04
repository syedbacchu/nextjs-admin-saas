'use client'

import { useEffect } from 'react'

interface AutoPrintProps {
    enabled?: boolean
}

export default function AutoPrint({ enabled = false }: AutoPrintProps) {
    useEffect(() => {
        if (!enabled) return

        const timeout = window.setTimeout(() => {
            // Print blocks until the dialog closes or is canceled, so this
            // returns control only after the user finishes the print action.
            window.print()
            window.close()
        }, 150)

        return () => {
            window.clearTimeout(timeout)
        }
    }, [enabled])

    return null
}
