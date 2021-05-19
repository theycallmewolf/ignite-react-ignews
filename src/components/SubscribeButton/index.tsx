import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceID: string;
}

export function SubscribeButton({ priceID }: SubscribeButtonProps) {
  const [session] = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if(!session) {
      signIn('github');
      return;
    }

    if(session.activeSubscription) {
      router.push('/posts');
      return;
    }

    // stripe checkout session
    try {
      const response = await api.post('/subscribe');
      const { sessionId } = response.data;
      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId });
    } catch(err) {
      alert(err.message);
    }
  }

  return (
    <button 
      type="button"
      className={styles.button}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}