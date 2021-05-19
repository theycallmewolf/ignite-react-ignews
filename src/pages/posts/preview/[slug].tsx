import { useEffect } from 'react';
import { GetStaticProps } from "next";
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../../services/prismic";
import styles from '../post.module.scss';

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(()=> {
    if(session?.activeSubscription) router.push(`/posts/${post.slug}`);
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
            dangerouslySetInnerHTML={{__html: post.content}}
            className={`${styles.content} ${styles.preview}`}
          />

          <div className={styles.keepReading}>
            Want to keep reading?
            <Link href="/">
              <a>Subscribe now</a>
            </Link>
            &nbsp;🤗
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps : GetStaticProps = async ({ params }) => {
  const { slug } = params;
  
  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug, 
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 2)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return {
    props: {
      post,
    }
  }
}