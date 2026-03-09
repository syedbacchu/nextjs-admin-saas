'use client';
import { Printer } from "lucide-react";

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors print:hidden shadow-sm"
        >
            <Printer size={16} />
            <span>Print List</span>
        </button>
    );
}