import { CheckoutFormData } from "@/lib/types"

type FieldProps = {
    id: keyof CheckoutFormData;
    label: string;
    value: string;
    error?: string;
    onChange: (id: keyof CheckoutFormData, value: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
};

export default function Field({ id, label, value, error, onChange, type = 'text', placeholder, required }: FieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(id, e.target.value)}
                className={`border rounded-md px-3 py-2 text-sm outline-none transition-colors
                    focus:ring-2 focus:ring-black focus:border-black
                    ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}