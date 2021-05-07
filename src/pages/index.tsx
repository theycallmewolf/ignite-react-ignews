import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import styles from './home.module.scss';

export default function Home() {
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
            <span>for $9.90 month</span>
          </p>
          <SubscribeButton />
        </section>
        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  );
}
