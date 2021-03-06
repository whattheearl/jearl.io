import ReactMarkdown from 'react-markdown';
import Head from 'next/head';
import styles from '../../styles/BlogPost.module.css';
import Header from '../../components/Header';
import Author from '../../lib/author';
import Posts from '../../lib/posts';

const Post = ({ author, post }: any) => {
  return (
    <>
      <Head>
        <title>{post.attributes.title} | jearl</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title={"Post"} back={true} />
      <main>
        <h1>{post.attributes.title}</h1>
        <h2>{author.username}</h2>
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </main>
    </>
  );
}
export default Post;

export async function getStaticPaths() {
  const slugs = Posts.getAll().map(p => p.attributes.slug);
  return {
    paths: slugs.map((slug: string) => ({ params: { slug, } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = Posts.get(params.slug);
  const author = Author.getMe();
  return { props: { post, author } };
}