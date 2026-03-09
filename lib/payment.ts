import { PaymentFormData } from "@/lib/types";


export function validatePayment(data: PaymentFormData): string | null {
    const cardDigits = data.cardNumber.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(cardDigits)) return "Invalid card number";

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate)) return "Invalid expiry date";
    const [month, year] = data.expiryDate.split("/").map(Number);
    const expiry = new Date(2000 + year, month - 1);
    if (expiry < new Date()) return "Card has expired";

    if (!/^\d{3,4}$/.test(data.securityCode)) return "Invalid security code";
    if (!data.cardholderName.trim()) return "Cardholder name is required";

    return null;
}

export function generatePaymentToken(): string {
    return `mock_tok_${crypto.randomUUID()}`;
}
