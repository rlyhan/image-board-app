import Link from "next/link";

type NavLinkProps = {
    href: string;
    label: string;
    className?: string;
}

const buttonStyles = {
    standard: "text-black hover:text-gray-900 dark:text-white dark:hover:text-gray-100 py-2 px-4 transition-colors"
}

export default function NavLink({ href, label, className }: NavLinkProps) {
    return (
        <Link
            href={href}
            className={className ?? buttonStyles.standard}
        >
            {label}
        </Link>
    );
}