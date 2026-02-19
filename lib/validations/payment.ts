import { PaymentFormData } from "../types";

export type PaymentFormErrors = Partial<Record<string, string>>;

export default function validate(data: PaymentFormData): PaymentFormErrors {
    const errors: PaymentFormErrors = {};

    if (!data.cardholderName.trim()) errors.cardholderName = 'Cardholder name is required';

    const strippedCardNumber = data.cardNumber.replace(/\s/g, '');
    if (!strippedCardNumber) {
        errors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(strippedCardNumber)) {
        errors.cardNumber = 'Enter a valid 16-digit card number';
    }

    if (!data.expiryDate) {
        errors.expiryDate = 'Expiry date is required';
    } else {
        const [month, year] = data.expiryDate.split('/').map(Number);
        const now = new Date();
        const expiry = new Date(2000 + year, month - 1);
        if (!month || !year || month < 1 || month > 12) {
            errors.expiryDate = 'Enter a valid expiry date';
        } else if (expiry < now) {
            errors.expiryDate = 'Card has expired';
        }
    }

    if (!data.securityCode) {
        errors.securityCode = 'Security code is required';
    } else if (!/^\d{3,4}$/.test(data.securityCode)) {
        errors.securityCode = 'Enter a valid 3 or 4 digit security code';
    }

    return errors;
}