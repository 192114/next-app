import React from 'react'

import request from '../../utils/request'

import styles from '../../styles/Home.module.css'

const News = ({ news }) => {
  return (
    <div className={styles.container}>
      <h3>{news.title}</h3>
      
      <article dangerouslySetInnerHTML={{ __html: news.contents }} />
    </div>
  )
}

export async function getServerSideProps(context) {
  // console.log(context)

  const { newsId } = context.params

  const data = await request.get(`https://m.yuge.com/unauthorize/newsDetail/id/${newsId}`)

  const {
    news,
  } = data.result

  return {
    props: {
      title: news.title,
      desc: news.summary,
      keyword: news.keywords.map(item => item.name).join(','),
      news,
    }, 
  }
}

export default News
