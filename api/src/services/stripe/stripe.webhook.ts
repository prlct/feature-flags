import Stripe from 'stripe';

export default function(event: Stripe.Event) {
  console.clear();
  console.log("EVENT_____________________");
  console.log(event);
}
