"use client";

import React, { useEffect, ReactNode } from "react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
};

function Modal({ open, onClose, children, title }: ModalProps) {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title ?? "Modal"}>
            <button
                type="button"
                className="absolute inset-0 bg-black/50 cursor-default"
                aria-label="Close modal"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800">
                {children}
            </div>
        </div>
    );
}

export default Modal;