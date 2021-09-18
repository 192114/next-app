import React, {
  useEffect,
  useState,
} from 'react'
import Image from "next/image"

import request from '../../utils/request'

import styles from './HotArticle.module.css'

const HotArticleList = ({ articleId }) => {
  const [hotArticleList, setHotArticleList] = useState([])

  useEffect(() => {
    if (!articleId) {
      return
    }
    // 获取热门文章
    const getHotArticleListRes = async () => {
      const data = await request.post(`/unauthorize/newsDetail/randomList/${articleId}`)
      if (data.resultCode === '0') {
        const {randomList} = data.result
        setHotArticleList(randomList)
      }
    }

    getHotArticleListRes()
  }, [articleId])

  const goNextPage = (e, nextArticleId) => {
    e.stopPropagation()
    const url = window.location.href

    const lastIndex = url.lastIndexOf('/')
    
    const preUrl = url.slice(0, lastIndex)

    const nextUrl = `${preUrl}/${nextArticleId}`

    window.location.href = nextUrl
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <Image 
          src="/zixun.svg"
          alt=""
          width="24px"
          height="24px"
        />
        <span className={styles['header-text']}>
          热门资讯
        </span>
      </div>

      <div className={styles.content}>
        {
          hotArticleList.map(item => (
            <div 
              className={styles['content-item']}
              key={item.id}
              onClick={e => goNextPage(e, item.id)}
            >
              <div className={styles['content-item--left']}>
                <div className={styles['content-item--left_top']}>
                  {item.title}
                </div>
                <div className={styles['content-item--left_bottom']}>
                  {
                    item.keywords.map(item => item.name).join('，')
                  }
                </div>
              </div>
              <div className={styles['content-item--right']}>
                <Image 
                  src={item.image}
                  alt=""
                  layout="fill"
                />
              </div>
            </div>
          ))
        }
        
      </div>
    </section>
  )
}

export default HotArticleList
