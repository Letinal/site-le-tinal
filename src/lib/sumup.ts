// Integration SumUp — creation d'un paiement d'adhesion en ligne.
// Trois modes, dans l'ordre de priorite :
//   1) API SumUp (SUMUP_API_KEY + SUMUP_MERCHANT_CODE) -> checkout hebergé + confirmation auto via webhook.
//   2) Lien de paiement fixe (SUMUP_PAYMENT_LINK)      -> redirection simple, pointage manuel dans l'espace admin.
//   3) Aucun                                            -> adhesion enregistree "a regler sur place".
export interface CheckoutResult {
  checkoutUrl: string | null;
  ref: string | null;
  moyen: string;
}

export async function creerPaiement(opts: {
  env: any;
  reference: string;
  montant: number;
  description: string;
  returnUrl: string;
  email: string;
}): Promise<CheckoutResult> {
  const { env, reference, montant, description, returnUrl, email } = opts;

  // Mode 1 : API SumUp (checkout hebergé)
  if (env.SUMUP_API_KEY && env.SUMUP_MERCHANT_CODE) {
    try {
      const r = await fetch("https://api.sumup.com/v0.1/checkouts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.SUMUP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkout_reference: reference,
          amount: montant,
          currency: "EUR",
          merchant_code: env.SUMUP_MERCHANT_CODE,
          description,
          return_url: returnUrl,
          redirect_url: returnUrl,
        }),
      });
      if (r.ok) {
        const data: any = await r.json();
        // Selon la configuration du compte, l'URL de paiement hebergé peut varier de nom.
        const url =
          data.hosted_checkout_url ||
          data.checkout_url ||
          data._links?.hosted_checkout?.href ||
          (data.id ? `https://pay.sumup.com/checkout/${data.id}` : null);
        return { checkoutUrl: url, ref: data.id || reference, moyen: "sumup_en_ligne" };
      }
    } catch (_) {
      // on retombe sur les modes suivants
    }
  }

  // Mode 2 : lien de paiement fixe
  if (env.SUMUP_PAYMENT_LINK) {
    return { checkoutUrl: env.SUMUP_PAYMENT_LINK, ref: reference, moyen: "sumup_lien" };
  }

  // Mode 3 : paiement sur place
  return { checkoutUrl: null, ref: reference, moyen: "sur_place" };
}
