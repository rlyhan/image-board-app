import Link from "next/link";

type ButtonLinkProps = {
    href: string;
    label: string;
    className?: string;
}

const buttonStyles = {
    standard: "text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-100 font-semibold py-2 px-4 border border-gray-400 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-300 rounded shadow transition-colors"
}

export default function ButtonLink({ href, label, className }: ButtonLinkProps) {
    return (
        <Link
            href={href}
            className={className ?? buttonStyles.standard}
        >
            {label}
        </Link>
    );
}