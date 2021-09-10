import React from 'react'
import Image from 'next/image'
import styles from './Banner.module.css'

const Banner = () => {
  return (
    <div className={styles.container}>
      <Image 
        src="/tt.png"
        alt=""
        layout="fill"
      />
    </div>
  )
}

export default Banner
