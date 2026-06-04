'use client';

import { useState, FormEvent } from 'react';
import { PaymentFormData } from '@/lib/types';
import { formatCardNumber, formatExpiryDate } from '@/lib/helpers/payment';
import validate, { PaymentFormErrors } from '@/lib/validations/payment';
import { validatePayment, generatePaymentToken } from '@/lib/payment';
import Field from './Field';
import { useOrder } from '@/context/OrderContext';
import { useCartStore } from '@/context/cartStore';

const INITIAL_FORM_STATE: PaymentFormData = {
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
};

type PaymentFormProps = {
    onSuccess: (orderId: string) => void;
};

export default function PaymentForm({ onSuccess }: PaymentFormProps) {
    const cartItems = useCartStore((s) => s.items);
    const clearCart = useCartStore((s) => s.clearCart);
    const { orderState, setSuccess } = useOrder();
    const [formData, setFormData] = useState<PaymentFormData>(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState<PaymentFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const handleChange = (id: string, value: string) => {
        let formatted = value;
        if (id === 'cardNumber') formatted = formatCardNumber(value);
        if (id === 'expiryDate') formatted = formatExpiryDate(value);
        if (id === 'securityCode') formatted = value.replace(/\D/g, '').slice(0, 4);

        setFormData((prev) => ({ ...prev, [id]: formatted }));
        if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setServerError(null);

        // Client-side format validation
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Additional validation: expiry not in the past, card digits within expected range
        const paymentError = validatePayment({
            ...formData,
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
        });
        if (paymentError) {
            setServerError(paymentError);
            return;
        }

        const { customerDetails } = orderState;
        if (!customerDetails) {
            setServerError('Missing customer details. Please go back and complete checkout.');
            return;
        }

        // Tokenize client-side — raw card data never leaves the browser
        const paymentToken = generatePaymentToken();

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerDetails,
                    paymentToken,
                    cartItems,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setServerError(data.error || 'Payment failed. Please try again.');
                setIsSubmitting(false);
                return;
            }

            setIsComplete(true);
            setSuccess();
            clearCart();
            onSuccess(data.orderId);
        } catch {
            setServerError('Something went wrong. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (isComplete) return null;

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold">Payment</h2>

            <Field
                id="cardholderName"
                label="Cardholder Name"
                value={formData.cardholderName}
                error={errors.cardholderName}
                onChange={handleChange}
                placeholder="Jane Smith"
            />
            <Field
                id="cardNumber"
                label="Card Number"
                value={formData.cardNumber}
                error={errors.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
                maxLength={19}
            />
            <div className="grid grid-cols-2 gap-4">
                <Field
                    id="expiryDate"
                    label="Expiry Date"
                    value={formData.expiryDate}
                    error={errors.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    type="numeric"
                    maxLength={5}
                />
                <Field
                    id="securityCode"
                    label="Security Code"
                    value={formData.securityCode}
                    error={errors.securityCode}
                    onChange={handleChange}
                    placeholder="CVV"
                    inputMode="numeric"
                    maxLength={4}
                />
            </div>

            {serverError && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {serverError}
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 bg-black text-white py-3 rounded-md text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
}
