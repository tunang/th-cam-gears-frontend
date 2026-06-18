'use server';

import { SePayPgClient } from 'sepay-pg-node';

const client = new SePayPgClient({
  env: (process.env.SEPAY_ENV as 'sandbox' | 'production') || 'sandbox',
  merchant_id: process.env.SEPAY_MERCHANT_ID!,
  secret_key: process.env.SEPAY_MERCHANT_SECRET_KEY!,
});

export interface SepayCheckoutData {
  checkoutUrl: string;
  formFields: Record<string, string | number | undefined>;
}

export async function prepareSepayCheckout(params: {
  orderInvoiceNumber: string;
  orderAmount: number;
  orderDescription: string;
}): Promise<SepayCheckoutData> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const checkoutURL = client.checkout.initCheckoutUrl();

  const checkoutFormfields = client.checkout.initOneTimePaymentFields({
    operation: 'PURCHASE',
    payment_method: 'BANK_TRANSFER',
    order_invoice_number: params.orderInvoiceNumber,
    order_amount: params.orderAmount,
    currency: 'VND',
    order_description: params.orderDescription,
    success_url: `${baseUrl}/checkout/success?order=${params.orderInvoiceNumber}`,
    error_url: `${baseUrl}/checkout/failed?order=${params.orderInvoiceNumber}`,
    cancel_url: `${baseUrl}/checkout?cancelled=true`,
  });

  return {
    checkoutUrl: checkoutURL,
    formFields: checkoutFormfields,
  };
}
