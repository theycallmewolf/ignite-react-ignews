import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceID: string;
    amount: number;
    product: {}
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>home | ig.news</title>
        <meta name="description" content="..." />
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋 Hi, coder!</span>
          <h1>Read all news from <span>React</span> world.</h1>
          <p>
            Get access to all publications <br />
            <span>for {product.amount} / month</span>
          </p>
          <SubscribeButton priceID={product.priceID} />
        </section>
        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1Ioc1gBuwG79YXZPF4MLgzQW', {
    expand: ['product']
  })

  const prod = price.product;

  const product = {
    priceID: price.id,
    amount: new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price.unit_amount / 100),
    product: prod,
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}