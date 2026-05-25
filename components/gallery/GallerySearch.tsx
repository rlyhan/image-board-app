"use client";

import { useState } from "react";

type SearchBarProps = {
    onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full mx-auto flex items-center py-8 px-4"
        >
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for images..."
                className="flex-grow px-4 py-2 rounded-l-2xl border border-2 border-r-0 border-gray-300 focus:outline-none text-center focus:ring-2 focus:ring-blue-500 focus:border-0"
                aria-label="Search"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-r-xl border border-2 border-blue-500 cursor-pointer hover:bg-blue-600"
            >
                Search
            </button>
        </form>
    );
}
