'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
    question: string
    answer: React.ReactNode
}

interface FAQSectionProps {
    title?: string
    items: FAQItem[]
}

export default function FAQSection({ title = "Frequently Asked Questions", items }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="w-full max-w-3xl mx-auto mt-16 px-4">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
                {title}
            </h2>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white border border-slate-200 rounded-lg overflow-hidden"
                    >
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                        >
                            <span className="font-semibold text-slate-700">{item.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                        </button>

                        {openIndex === index && (
                            <div className="p-4 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
