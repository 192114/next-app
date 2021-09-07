import React from 'react'
import Image from 'next/image'

import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-top']}>
        <div className={styles['img-box']}>
          <Image src="/footlogo.png" alt="" width="100" height="100" />
          <p>渔歌医疗</p>
        </div>
        <div className={styles['img-box']}>
          <Image src="/footapp.png" alt="" width="100" height="100" />
          <p>长按识别二维码关注</p>
        </div>
      </div>
      
      <p className={styles['footer-bottom']}>
        渔歌医疗致力于为医联体/医共体、医生集团、区域性分级诊疗提供连续的服务与解决方案
      </p>
    </footer>
  )
}

export default Footer
