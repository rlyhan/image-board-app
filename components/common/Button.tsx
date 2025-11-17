import cn from "classnames";

type ButtonProps = {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    label: string;
    additionalClasses?: string;
    variant?: "default" | "light" | "dark" | "green" | "red";
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

const base = `
    font-semibold py-2 px-4 rounded shadow transition-colors border cursor-pointer
`;

const themes = {
    default: `
        text-gray-800 hover:text-gray-900 
        dark:text-white dark:hover:text-gray-100
        border-gray-400 dark:border-gray-600
        hover:border-gray-500 dark:hover:border-gray-300
    `,
    light: `
        text-gray-800 hover:text-gray-900
        border-gray-300 hover:border-gray-400
        bg-white hover:bg-gray-50
    `,
    dark: `
        text-white hover:text-gray-100
        border-gray-700 hover:border-gray-500
        bg-gray-800 hover:bg-gray-700
    `,
    green: `
        text-white
        bg-green-600 hover:bg-green-700
        border-green-700 hover:border-green-800
        dark:bg-green-500 dark:hover:bg-green-600
        dark:border-green-600 dark:hover:border-green-700
    `,
    red: `
        text-white
        bg-red-600 hover:bg-red-700
        border-red-700 hover:border-red-800
        dark:bg-red-500 dark:hover:bg-red-600
        dark:border-red-600 dark:hover:border-red-700
    `,
};

export default function Button({
    onClick,
    label,
    additionalClasses,
    variant = "default"
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                base,
                themes[variant],
                additionalClasses
            )}
        >
            {label}
        </button>
    );
}
