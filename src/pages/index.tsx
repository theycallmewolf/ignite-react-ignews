import styles from '../styles/home.module.scss';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>home | ig.news</title>
        <meta name="description" content="..." />
      </Head>
      <h1 className={styles.title}>Hello Wolf!</h1>
    </>
  );
}
