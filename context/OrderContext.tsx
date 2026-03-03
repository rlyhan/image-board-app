'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CheckoutFormData } from '@/lib/types';

type OrderState = {
    customerDetails: CheckoutFormData | null;
    status: 'idle' | 'processing' | 'success' | 'error';
    errorMessage: string | null;
};

type OrderContextType = {
    orderState: OrderState;
    updateCustomerDetails: (customerDetails: CheckoutFormData) => void;
    setProcessing: () => void;
    setSuccess: () => void;
    setError: (message: string) => void;
};

type OrderAction =
    | { type: 'UPDATE_CUSTOMER'; payload: CheckoutFormData }
    | { type: 'SET_PROCESSING' }
    | { type: 'SET_SUCCESS' }
    | { type: 'SET_ERROR'; payload: string };

const INITIAL_STATE: OrderState = {
    customerDetails: null,
    status: 'idle',
    errorMessage: null,
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

function orderReducer(state: OrderState, action: OrderAction): OrderState {
    switch (action.type) {
        case 'UPDATE_CUSTOMER':
            return { ...state, customerDetails: action.payload };
        case 'SET_PROCESSING':
            return { ...state, status: 'processing', errorMessage: null };
        case 'SET_SUCCESS':
            return { ...state, status: 'success' };
        case 'SET_ERROR':
            return { ...state, status: 'error', errorMessage: action.payload };
        default:
            return state;
    }
}

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orderState, dispatch] = useReducer(orderReducer, INITIAL_STATE);

    const updateCustomerDetails = (customerDetails: CheckoutFormData) => {
        dispatch({ type: 'UPDATE_CUSTOMER', payload: customerDetails });
    };

    const setProcessing = () => dispatch({ type: 'SET_PROCESSING' });
    const setSuccess = () => dispatch({ type: 'SET_SUCCESS' });
    const setError = (message: string) => dispatch({ type: 'SET_ERROR', payload: message });

    return (
        <OrderContext.Provider value={{ orderState, updateCustomerDetails, setProcessing, setSuccess, setError }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrder() {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within OrderProvider');
    }
    return context;
}