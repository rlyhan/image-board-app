'use client';

import { useState, FormEvent } from 'react';
import { CheckoutFormData } from "@/lib/types"
import validate, { CheckoutFormErrors } from "@/lib/validations/customer"
import Field from './Field';
import { useOrder } from '@/context/OrderContext';

const INITIAL_FORM_STATE: CheckoutFormData = {
    firstName: '',
    lastName: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
};

type CheckoutFormProps = {
    onSuccess: () => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
    const { updateCustomerDetails } = useOrder();
    const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState<CheckoutFormErrors>({});

    const handleChange = (id: string, value: string) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
        if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const validationErrors = validate(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        updateCustomerDetails(formData);
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            {/* Name */}
            <fieldset className="grid grid-cols-2 gap-4">
                <legend className="text-sm font-semibold text-gray-900 mb-3 col-span-2">Personal Details</legend>
                <Field
                    id="firstName"
                    label="First Name"
                    value={formData.firstName}
                    error={errors.firstName}
                    onChange={handleChange}
                    placeholder="Jane"
                    required
                />
                <Field
                    id="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    error={errors.lastName}
                    onChange={handleChange}
                    placeholder="Smith"
                    required
                />
            </fieldset>

            {/* Email */}
            <Field
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                error={errors.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
            />

            {/* Address */}
            <fieldset className="flex flex-col gap-4">
                <legend className="text-sm font-semibold text-gray-900 mb-3">Delivery Address</legend>
                <Field
                    id="addressLine1"
                    label="Address Line 1"
                    value={formData.addressLine1}
                    error={errors.addressLine1}
                    onChange={handleChange}
                    placeholder="123 Example Street"
                    required
                />
                <Field
                    id="addressLine2"
                    label="Address Line 2"
                    value={formData.addressLine2}
                    error={errors.addressLine2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc. (optional)"
                />
                <div className="grid grid-cols-2 gap-4">
                    <Field
                        id="city"
                        label="City"
                        value={formData.city}
                        error={errors.city}
                        onChange={handleChange}
                        placeholder="London"
                        required
                    />
                    <Field
                        id="postcode"
                        label="Postcode"
                        value={formData.postcode}
                        error={errors.postcode}
                        onChange={handleChange}
                        placeholder="SW1A 1AA"
                        required
                    />
                </div>
            </fieldset>

            <button
                type="submit"
                className="mt-2 bg-black text-white py-3 rounded-md text-sm font-medium hover:opacity-80 transition-opacity"
            >
                Continue to payment
            </button>
        </form>
    );
}
