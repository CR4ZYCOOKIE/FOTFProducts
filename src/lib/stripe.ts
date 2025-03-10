import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createSubscription = async (priceId: string, discordUsername: string) => {
  try {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, discordUsername }),
    });
    
    const session = await response.json();
    const stripe = await stripePromise;
    
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      
      if (error) {
        throw new Error(error.message);
      }
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};