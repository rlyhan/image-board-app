import { CheckoutFormData } from "@/lib/types"

export type CheckoutFormErrors = Partial<Record<string, string>>;

export default function validate(data: CheckoutFormData): CheckoutFormErrors {
    const errors: CheckoutFormErrors = {};

    if (!data.firstName.trim()) errors.firstName = 'First name is required';
    if (!data.lastName.trim()) errors.lastName = 'Last name is required';
    if (!data.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Enter a valid email address';
    }
    if (!data.addressLine1.trim()) errors.addressLine1 = 'Address is required';
    if (!data.city.trim()) errors.city = 'City is required';
    if (!data.postcode.trim()) {
        errors.postcode = 'Postcode is required';
    } else if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(data.postcode)) {
        errors.postcode = 'Enter a valid UK postcode';
    }

    return errors;
}