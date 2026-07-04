'use client'

import { FaPlus, FaTrash } from "react-icons/fa";
import { useI18n } from '@/components/providers/I18nProvider'
import { translateUiText } from '@/i18n/ui'

interface FieldConfig {
    name: string;
    label: string;
    placeholder?: string;
    type?: "text" | "number" | "textarea"; // Add types as needed
}

interface DynamicRepeaterProps {
    title: string;
    fields: FieldConfig[];
    values: any[];
    onChange: (newValues: any[]) => void;
}

export default function DynamicRepeater({ title, fields, values, onChange }: DynamicRepeaterProps) {
    const safeValues = Array.isArray(values) ? values : [];
    const { language } = useI18n()
    const handleAdd = () => {
        // Create an empty object based on fields
        const newItem = fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});
        onChange([...values, newItem]);
    };

    const handleRemove = (index: number) => {
        const newValues = values.filter((_, i) => i !== index);
        onChange(newValues);
    };

    const handleChange = (index: number, fieldName: string, val: string) => {
        const newValues = [...values];
        newValues[index] = { ...newValues[index], [fieldName]: val };
        onChange(newValues);
    };


    return (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <h3 className="font-bold text-gray-700">{translateUiText(title, language)}</h3>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                    <FaPlus size={12} /> {translateUiText('Add New', language)}
                </button>
            </div>

            {safeValues.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start bg-white p-3 rounded border border-gray-100 shadow-sm animate-fadeIn">
                    {/* Serial Number (Auto-generated) */}
                    <div className="w-full sm:w-16">
                        <label className="text-xs font-bold text-gray-400 uppercase">{translateUiText('Serial', language)}</label>
                        <input
                            disabled
                            value={index + 1}
                            className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-2 text-center text-gray-600 font-bold"
                        />
                    </div>

                    {/* Dynamic Fields */}
                    {fields.map((field) => (
                        <div key={field.name} className="flex-1 w-full">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">
                                {translateUiText(field.label, language)}
                            </label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    value={item[field.name] || ""}
                                    onChange={(e) => handleChange(index, field.name, e.target.value)}
                                    placeholder={field.placeholder ? translateUiText(field.placeholder, language) : undefined}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    rows={1}
                                />
                            ) : (
                                <input
                                    type={field.type || "text"}
                                    value={item[field.name] || ""}
                                    onChange={(e) => handleChange(index, field.name, e.target.value)}
                                    placeholder={field.placeholder ? translateUiText(field.placeholder, language) : undefined}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                                />
                            )}
                        </div>
                    ))}

                    {/* Remove Button */}
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="text-red-500 hover:text-red-700 p-2 transition"
                            title={translateUiText('Remove Row', language)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}

            {values.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm italic">
                    {translateUiText('No items added yet. Click "Add New" to start.', language)}
                </div>
            )}
        </div>
    );
}
