import type { NextPage } from 'next'
import { useState } from 'react';
import Head from 'next/head'
import Header from '../../components/Header';
import ProfileDetail from '../../components/ProfileDetail';
import BlogList from '../../components/BlogList';
import styles from '../styles/Home.module.css'
import Selector from '../../components/Selector';
import Footer from '../../components/Footer';
import Posts from '../../lib/posts';
import Author from '../../lib/author';
import Projects from '../../lib/projects';
import ProjectList from '../../components/ProjectList';
import About from '../../components/About';

const Home: NextPage = ({ posts, projects, author }: any) => {
  const [show, setShow] = useState<'post' | 'project' | 'about'>('post');
  const section = () => {
    switch (show) {
      case 'post': return <BlogList posts={posts} />;
      case 'project': return <ProjectList projects={projects} />;
      case 'about': return <About author={author} />;
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>posts | jearl</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title={author.attributes.username} />
      <main className={styles.main}>
        <ProfileDetail
          username={author.attributes.username}
          name={author.attributes.name}
          picture={author.attributes.picture}
          excerpt={author.attributes.excerpt} />
        <Selector
          postCount={posts?.length | 0}
          projectCount={projects?.length | 0}
          setShow={setShow} />
        {section()}
      </main>
      <Footer />
    </div>
  )
}

export async function getStaticProps() {
  const posts = Posts.getAll();
  const author = Author.getMe();
  const projects = Projects.getAll();
  return {
    props: {
      posts,
      author,
      projects,
    }
  }
}

export default Home
