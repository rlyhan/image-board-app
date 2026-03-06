'use client';

import { useCart } from '@/context/CartContext';
import { PexelImage } from '@/lib/types';
import Button from '../common/Button';
import Cart from "@/components/icons/Cart"

type AddCartButtonProps = {
    image: PexelImage;
};

export default function AddCartButton({ image }: AddCartButtonProps) {
    const { addToCart, getItemQuantity } = useCart();
    const quantity = getItemQuantity(image.id);

    return (
        <Button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(image);
            }}
            label={<Cart count={quantity} />}
            variant="round"
            theme="light"
            additionalClasses="h-[42px] w-[42px] relative"
        />
    );
}