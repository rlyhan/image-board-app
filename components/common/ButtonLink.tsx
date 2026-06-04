import Link from "next/link";
import { ReactNode } from "react";
import classNames from "classnames";

type ButtonLinkProps = {
    href: string;
    label: string | ReactNode;
    className?: string;
    additionalClasses?: string;
    ariaLabel?: string;
    external?: boolean;
}

const defaultClasses = "transition-colors"

const buttonStyles = {
    standard: "shadow text-gray-800 hover:text-gray-900 font-semibold py-2 px-4 border border-gray-400 hover:border-gray-500 rounded"
}

export default function ButtonLink({ href, label, className, ariaLabel, external }: ButtonLinkProps) {
    const classes = classNames(defaultClasses, className ?? buttonStyles.standard);

    // Routes that redirect to an external provider (e.g. Auth0) must use a
    // plain anchor so the browser does a full navigation. Next.js <Link> would
    // prefetch / fetch the RSC payload and follow the redirect cross-origin,
    // which the provider blocks via CORS.
    if (external) {
        return (
            <a href={href} className={classes} aria-label={ariaLabel}>
                {label}
            </a>
        );
    }

    return (
        <Link
            href={href}
            className={classes}
            aria-label={ariaLabel}
        >
            {label}
        </Link >
    );
}