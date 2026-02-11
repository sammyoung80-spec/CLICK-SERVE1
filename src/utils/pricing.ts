import { TRANSPORT_RATE_PER_KM, PLATFORM_FEE_PERCENT, CREDIT_SURCHARGE_PERCENT, DISCOUNTING_FEE_PERCENT } from '../lib/constants';

export const calculateBuyerTotal = (
    pricePerLiter: number,
    quantity: number,
    distanceKm: number,
    useCredit: boolean = false
) => {
    const baseFuelCost = pricePerLiter * quantity;
    const transportCost = TRANSPORT_RATE_PER_KM * distanceKm;
    const subtotal = baseFuelCost + transportCost;

    const platformFee = subtotal * PLATFORM_FEE_PERCENT;
    const creditSurcharge = useCredit ? subtotal * CREDIT_SURCHARGE_PERCENT : 0;

    const total = subtotal + platformFee + creditSurcharge;

    return {
        baseFuelCost,
        transportCost,
        platformFee,
        creditSurcharge,
        total
    };
};

export const calculateSupplierPayout = (
    pricePerLiter: number,
    quantity: number
) => {
    const gross = pricePerLiter * quantity;
    // Supplier pays no fee? Or platform fee is on top?
    // In this model, buyer pays fee. Supplier gets base cost. 
    // Wait, business logic says "Transport Rate * Distance + 2% Platform Fee".
    // Usually supplier just gets (Price * Qty).
    return gross;
};

export const calculateInvoiceDiscounting = (invoiceValue: number) => {
    const discountingFee = invoiceValue * DISCOUNTING_FEE_PERCENT;
    const liquidityPayout = invoiceValue - discountingFee;

    return {
        invoiceValue,
        discountingFee,
        liquidityPayout,
        feePercent: DISCOUNTING_FEE_PERCENT * 100
    };
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};
