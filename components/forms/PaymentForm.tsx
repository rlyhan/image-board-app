'use client';

import { useState, FormEvent } from 'react';
import { PaymentFormData } from '@/lib/types';
import { formatCardNumber, formatExpiryDate } from '@/lib/helpers/payment';
import validate, { PaymentFormErrors } from '@/lib/validations/payment';
import Field from './Field';

const INITIAL_FORM_STATE: PaymentFormData = {
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
};

type PaymentFormProps = {
    onSuccess: () => void;
};

export default function PaymentForm({ onSuccess }: PaymentFormProps) {
    const [formData, setFormData] = useState<PaymentFormData>(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState<PaymentFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
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

        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardholderName: formData.cardholderName,
                    cardNumber: formData.cardNumber.replace(/\s/g, ''),
                    expiryDate: formData.expiryDate,
                    securityCode: formData.securityCode,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setServerError(data.message || 'Payment failed. Please try again.');
                return;
            }

            onSuccess();
        } catch {
            setServerError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
