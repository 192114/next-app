import React from 'react'
import Image from 'next/image'
import styles from './Banner.module.css'

const Banner = () => {
  return (
    <header className={styles.container}>
      <div>
        <Image 
          src="/tt.png"
          alt=""
          layout="fill"
        />
      </div>
    </header>
  )
}

export default Banner
