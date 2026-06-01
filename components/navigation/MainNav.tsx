"use client";

import Image from "next/image";
import Link from "next/link";
import { ButtonLink, NavLink } from "../common";
import Cart from "../icons/Cart";
import Person from "../icons/Person";
import { useCart } from "@/context/CartContext";
import logo from "@/app/logo.png";

type MainNavProps = {
    isAuthenticated?: boolean;
}

export default function MainNav({ isAuthenticated = false }: MainNavProps) {
    const { getCartTotal, isHydrated } = useCart();
    const cartTotal = getCartTotal()

    return (
        <header data-cart-hydrated={isHydrated ? "true" : "false"}>
            <nav aria-label="Main" className="max-w-[1500px] mx-auto p-2 py-4 md:p-8 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 self-center">
                    <Image src={logo} alt="" width={32} height={32} priority />
                    <span className="text-xl md:text-2xl">Image Board App</span>
                </Link>
                <ul className="flex gap-5 items-center mr-2 md:mr-0">
                    <li>
                        <ButtonLink
                            href="/cart"
                            label={<Cart includeQuantity={cartTotal > 0} count={cartTotal} />}
                            className="inline-flex hover:opacity-50 md:px-3"
                            ariaLabel={isHydrated && cartTotal > 0 ? `Cart, ${cartTotal} item${cartTotal === 1 ? "" : "s"}` : "Cart"}
                        />
                    </li>
                    {isAuthenticated ?
                        (<>
                            <li className="flex hidden md:block">
                                <NavLink href="/dashboard" label="Dashboard" />
                            </li>
                            <li className="flex md:hidden">
                                <ButtonLink href="/dashboard" label={<Person />} className="inline-flex hover:opacity-50" ariaLabel="Dashboard" />
                            </li>
                            <li className="flex hidden md:block">
                                <NavLink href="/auth/logout" label="Log Out" />
                            </li>
                        </>) :
                        (<>
                            <li className="flex md:hidden">
                                <ButtonLink href="/auth/login" label={<Person />} className="inline-flex hover:opacity-50" ariaLabel="Log in" />
                            </li>
                            <li className="hidden md:block">
                                <ButtonLink href="/auth/login" label="Log In" />
                            </li>
                        </>)}
                </ul>
            </nav>
        </header>
    );
}
