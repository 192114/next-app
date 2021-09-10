import classnames from 'classnames'
import Head from 'next/head'
import Banner from '../components/Banner'
import Footer from '../components/Footer'
import '../styles/globals.css'

function MyApp({Component, pageProps}) {
  const {
    title,
    desc,
    keyword,
    clientName,
  } = pageProps
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0,viewport-fit=cover" />
        <meta name="keywords" content={keyword} />
        <meta name="description" content={desc} />
      </Head>
      {
        clientName !== 'app' && <Banner />
      }
      
      <div className={classnames({ pt44: clientName !== 'app' })}>
        <Component {...pageProps} />
      </div>

      <Footer />
    </>
  )
}

export default MyApp
