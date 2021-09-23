import Image from 'next/image'

import styles from '../styles/404.module.css'

export default function Custom404() {
  return <div className={styles.container}>
    <div>
      <div className={styles.tc}>
        <Image 
          src="/no-article-pic.png"
          width="73"
          height="73"
          alt=""
        />
      </div>
      <div className={styles.mt20}>
        <Image 
          src="/no-article-txt.png"
          width="107"
          height="17"
          alt=""
        />
      </div>
    </div>
  </div>
}