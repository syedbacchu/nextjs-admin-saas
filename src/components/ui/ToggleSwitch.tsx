import { useState } from "react";

interface ToggleSwitchProps {
    isActive: boolean;
    onToggle: (newState: boolean) => Promise<void>; // Async callback
}

export default function ToggleSwitch({ isActive, onToggle }: ToggleSwitchProps) {
    const [isLoading, setIsLoading] = useState(false);

    // We use local state for immediate feedback (Optimistic UI)
    // or just rely on props if we want to wait for server
    const toggleHandler = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            await onToggle(!isActive);
        } catch (error) {
            console.error("Toggle failed", error);
            // Optionally revert state here if using local state
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleHandler}
            disabled={isLoading}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                ${isActive ? 'bg-emerald-500' : 'bg-gray-300'}
                ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
            `}
            role="switch"
            aria-checked={isActive}
        >
            <span
                className={`
                    ${isActive ? 'translate-x-6' : 'translate-x-1'}
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                `}
            />
        </button>
    );
}