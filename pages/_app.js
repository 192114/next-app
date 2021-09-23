import classnames from 'classnames'
import Head from 'next/head'
import Script from 'next/script'
import Banner from '../components/Banner'
import Footer from '../components/Footer'
import '../styles/globals.css'

function MyApp({Component, pageProps}) {
  const {
    title,
    desc,
    keyword,
    clientName,
    deviceTypeName,
    articleUrl,
  } = pageProps

  return (
    <>
      {
        clientName === 'wechat' && <Script src="http://res.wx.qq.com/open/js/jweixin-1.6.0.js"></Script>
      }

      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0,viewport-fit=cover" />
        <meta name="keywords" content={keyword} />
        <meta name="description" content={desc} />
      </Head>
      
      {
        clientName !== 'app' && title && <Banner 
          clientName={clientName}
          deviceTypeName={deviceTypeName}
          articleUrl={articleUrl}
        />
      }
      
      <div className={classnames({ pt44: clientName !== 'app' && title })}>
        <Component {...pageProps} />
      </div>

      <Footer />
    </>
  )
}

export default MyApp
