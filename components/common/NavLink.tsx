import Link from "next/link";

type NavLinkProps = {
    href: string;
    label: string;
    className?: string;
    external?: boolean;
}

const buttonStyles = {
    standard: "text-black hover:opacity-50 py-2 px-3 transition-colors"
}

export default function NavLink({ href, label, className, external }: NavLinkProps) {
    const classes = className ?? buttonStyles.standard;

    // Routes that redirect to an external provider (e.g. Auth0) must use a
    // plain anchor so the browser does a full navigation. Next.js <Link> would
    // prefetch / fetch the RSC payload and follow the redirect cross-origin,
    // which the provider blocks via CORS.
    if (external) {
        return (
            <a href={href} className={classes}>
                {label}
            </a>
        );
    }

    return (
        <Link
            href={href}
            className={classes}
        >
            {label}
        </Link>
    );
}