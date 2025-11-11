type ButtonLinkProps = {
    href: string;
    label: string;
    className?: string;
}

const buttonStyles = {
    standard: "text-white hover:text-gray-100 font-semibold py-2 px-4 border border-gray-400 hover:border-gray-100 rounded shadow"
}

export default function ButtonLink({ href, label, className }: ButtonLinkProps) {
    return (
        <a
            href={href}
            className={className ?? buttonStyles.standard}
        >
            {label}
        </a>
    );
}