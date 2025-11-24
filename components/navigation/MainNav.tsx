import Link from "next/link";
import { ButtonLink, NavLink } from "../common";

type MainNavProps = {
    isAuthenticated?: boolean;
}

export default function MainNav({ isAuthenticated = false }: MainNavProps) {
    return (
        <header>
            <nav className="max-w-[1500px] mx-auto p-8 flex justify-between">
                <Link href="/" className="text-2xl block self-center">Image Board App</Link>
                <ul className="flex gap-2">
                    {isAuthenticated ?
                        (<>
                            <NavLink href="/dashboard" label="Dashboard" />
                            <ButtonLink href="/auth/logout" label="Log Out" />
                        </>) :
                        (<ButtonLink href="/auth/login" label="Log In" />)}
                </ul>
            </nav>
        </header>
    );
}