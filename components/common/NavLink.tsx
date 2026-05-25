import Link from "next/link";

type NavLinkProps = {
    href: string;
    label: string;
    className?: string;
}

const buttonStyles = {
    standard: "text-black hover:opacity-50 py-2 px-3 transition-colors"
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