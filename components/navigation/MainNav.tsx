"use client";

import Link from "next/link";
import { ButtonLink, NavLink } from "../common";
import Cart from "../icons/Cart";
import { useCart } from "@/context/CartContext";

type MainNavProps = {
    isAuthenticated?: boolean;
}

export default function MainNav({ isAuthenticated = false }: MainNavProps) {
    const { getCartTotal, isHydrated } = useCart();
    const cartTotal = getCartTotal()

    return (
        <header data-cart-hydrated={isHydrated ? "true" : "false"}>
            <nav className="max-w-[1500px] mx-auto p-8 flex justify-between">
                <Link href="/" className="text-2xl block self-center">Image Board App</Link>
                <ul className="flex gap-6 items-center">
                    <ButtonLink href="/cart" label={<Cart includeQuantity={cartTotal > 0} count={cartTotal} />} className="hover:opacity-50" />
                    {isAuthenticated ?
                        (<>
                            <NavLink href="/dashboard" label="Dashboard" />
                            <ButtonLink href="/auth/logout" label="Log Out" />
                        </>) :
                        (<>
                            <ButtonLink href="/auth/login" label="Log In" />
                        </>)}
                </ul>
            </nav>
        </header>
    );
}