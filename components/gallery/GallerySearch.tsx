"use client";

import { useState, useEffect, useRef } from "react";

type SearchBarProps = {
    onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onSearchRef = useRef(onSearch);
    const mountedRef = useRef(false);

    useEffect(() => {
        onSearchRef.current = onSearch;
    }, [onSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onSearchRef.current(query.trim());
    };

    useEffect(() => {
        if (!mountedRef.current) {
            mountedRef.current = true;
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearchRef.current(query.trim());
        }, 500);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    return (
        <div className="w-full flex justify-center py-8 px-4">
            <form
                onSubmit={handleSubmit}
                className={`group relative w-full flex items-center transition-[max-width] duration-300 ease-in-out motion-reduce:transition-none ${focused ? "max-w-[680px]" : "max-w-[520px] hover:max-w-[680px]"
                    }`}
            >
                <span
                    className={`absolute left-4 pointer-events-none transition-colors duration-300 motion-reduce:transition-none ${focused ? "text-blue-500" : "text-gray-400"
                        }`}
                    aria-hidden="true"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </span>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Search for images..."
                    className={`w-full pl-11 pr-28 rounded-full border-2 bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400 text-base focus:outline-none transition-[border-color,box-shadow,background-color,padding] duration-300 ease-in-out motion-reduce:transition-none ${focused ? "py-[14px]" : "py-[10px] group-hover:py-[14px]"
                        } ${focused
                            ? "border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                            : "border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] group-hover:border-gray-300 group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.09)]"
                        }`}
                    aria-label="Search"
                />

                <button
                    type="submit"
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-[7px] rounded-full text-sm font-medium cursor-pointer hover:opacity-90 transition-[background-color,color,box-shadow] duration-[250ms] ease-in-out motion-reduce:transition-none ${focused
                        ? "bg-blue-500 text-white shadow-[0_2px_8px_rgba(59,130,246,0.25)]"
                        : "bg-gray-200 text-gray-700 shadow-none group-hover:bg-gray-300 group-hover:text-gray-600"
                        }`}
                >
                    Search
                </button>
            </form>
        </div>
    );
}
