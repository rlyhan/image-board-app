import Link from "next/link";
import { ReactNode } from "react";
import classNames from "classnames";

type ButtonLinkProps = {
    href: string;
    label: string | ReactNode;
    className?: string;
}

const defaultClasses = "transition-colors"

const buttonStyles = {
    standard: "shadow text-gray-800 hover:text-gray-900 font-semibold py-2 px-4 border border-gray-400 hover:border-gray-500 rounded"
}

export default function ButtonLink({ href, label, className }: ButtonLinkProps) {
    return (
        <Link
            href={href}
            className={classNames(defaultClasses, className ?? buttonStyles.standard)}
        >
            {label}
        </Link >
    );
}