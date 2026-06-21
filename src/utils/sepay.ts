interface StoredSepayCheckout {
  checkoutUrl: string;
  formFields: Record<string, string | number | undefined>;
}

export function submitSepayPayment(paymentLink: string) {
  let checkout: StoredSepayCheckout;

  try {
    checkout = JSON.parse(paymentLink) as StoredSepayCheckout;
  } catch {
    window.location.assign(paymentLink);
    return;
  }

  const url = new URL(checkout.checkoutUrl);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Invalid SePay checkout URL');
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url.toString();
  form.hidden = true;

  Object.entries(checkout.formFields).forEach(([name, value]) => {
    if (value === undefined) return;
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
