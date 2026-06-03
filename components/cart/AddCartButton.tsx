'use client';

import { useCartStore, selectItemQuantity } from '@/context/cartStore';
import { useToast } from '@/context/ToastContext';
import { PexelImage } from '@/lib/types';
import Button from '../common/Button';
import Cart from '@/components/icons/Cart';
import Tick from '@/components/icons/Tick';

type AddCartButtonProps = {
    image: PexelImage;
};

export default function AddCartButton({ image }: AddCartButtonProps) {
    const addToCart = useCartStore((s) => s.addToCart);
    const quantity = useCartStore(selectItemQuantity(image.id));
    const { showToast } = useToast();
    const inCart = quantity > 0;

    function handleAddToCart(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        addToCart(image);
        showToast('Added to cart');
    }

    return (
        <Button
            onClick={handleAddToCart}
            label={inCart ? <Tick /> : <Cart count={quantity} />}
            aria-label={inCart ? `${image.alt} added to cart` : `Add ${image.alt} to cart`}
            variant="round"
            theme={inCart ? 'green' : 'light'}
            additionalClasses="h-[42px] w-[42px] relative transition-colors"
        />
    );
}
