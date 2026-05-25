'use client';

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
} from 'react';

type ToastEntry = {
    id: number;
    message: string;
    exiting: boolean;
};

type ToastContextType = {
    showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const DISPLAY_DURATION = 2800;   // how long the toast stays visible
const EXIT_DURATION    = 250;    // must match .toast-exit animation duration

function ToastItem({ message, exiting }: { message: string; exiting: boolean }) {
    return (
        <div
            role="status"
            aria-live="polite"
            style={{ left: '50%' }}
            className={`fixed bottom-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-full
                bg-gray-900 text-white text-sm font-medium shadow-lg
                pointer-events-none select-none whitespace-nowrap
                ${exiting ? 'toast-exit' : 'toast-enter'}`}
        >
            {/* inline checkmark so no extra import inside context */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-400 shrink-0"
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
            {message}
        </div>
    );
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastEntry[]>([]);

    const showToast = useCallback((message: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, exiting: false }]);
    }, []);

    // Handle the display → exit → remove lifecycle for each toast
    useEffect(() => {
        if (toasts.length === 0) return;

        const latest = toasts[toasts.length - 1];
        if (latest.exiting) return; // already scheduled for removal

        const exitTimer = setTimeout(() => {
            setToasts(prev =>
                prev.map(t => t.id === latest.id ? { ...t, exiting: true } : t)
            );
        }, DISPLAY_DURATION);

        const removeTimer = setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== latest.id));
        }, DISPLAY_DURATION + EXIT_DURATION);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(removeTimer);
        };
    }, [toasts]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.map(toast => (
                <ToastItem key={toast.id} message={toast.message} exiting={toast.exiting} />
            ))}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
