import React from 'react'
import Image from 'next/image'
import WithBackNative from '../WithBackNative'
import styles from './Banner.module.css'

const Banner = ({
  clientName,
  deviceTypeName,
  articleUrl,
}) => {
  return (
    <header className={styles.container}>
      <div>
        <WithBackNative
          clientName={clientName}
          deviceTypeName={deviceTypeName}
          articleUrl={articleUrl}
        >
          <Image 
            src="/tt.png"
            alt=""
            layout="fill"
          />
        </WithBackNative>
      </div>
    </header>
  )
}

export default Banner
