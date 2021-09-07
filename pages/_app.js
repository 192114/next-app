import Head from 'next/head'
import Footer from '../components/Footer'
import '../styles/globals.css'

function MyApp({Component, pageProps}) {
  const {
    title,
    desc,
    keyword,
  } = pageProps
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;" />
        <meta name="keywords" content={keyword} />
        <meta name="description" content={desc} />
      </Head>
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default MyApp
