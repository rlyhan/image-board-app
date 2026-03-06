// Formats card number input into groups of 4: 1234 5678 9012 3456
export function formatCardNumber(value: string): string {
    return value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
}

// Formats expiry date input as MM/YY
export function formatExpiryDate(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
}