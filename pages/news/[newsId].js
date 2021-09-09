import React, {useRef, useState} from 'react'
import Image from 'next/image'
import classnames from 'classnames'
import {useRouter} from 'next/dist/client/router'

import request from '../../utils/request'
import styles from '../../styles/Home.module.css'

const News = ({news}) => {
  const router  = useRouter()
  const { newsId } = router.query

  const articleDomRef = useRef(null)
  const audioDomRef = useRef(null)
  const haveLoadAudio = useRef(false)

  const [currentFontSize, setCurrentFontSize] = useState('normal')
  const [isPlaying, setisPlaying] = useState(false)

  const changeFontSize = (e, cur) => {
    e.stopPropagation()

    if (cur === currentFontSize) {
      return
    }

    const allDom = articleDomRef.current.querySelectorAll('span')
    Array.from(allDom).forEach(item => {
      const preFontSize = parseInt(item.style.fontSize, 10)

      let step = 0
      if ((currentFontSize === 'small' && cur === 'normal') || (currentFontSize === 'normal' && cur === 'large')) {
        step = 2
      }

      if (currentFontSize === 'small' && cur === 'large') {
        step = 4
      }

      if ((currentFontSize === 'normal' && cur === 'small') || (currentFontSize === 'large' && cur === 'normal')) {
        step = -2
      }

      if (currentFontSize === 'large' && cur === 'small') {
        step = -4
      }
      
      item.style.fontSize = `${preFontSize + step}px`
    })

    setCurrentFontSize(cur)
  }

  const onPlayAudio = async (e) => {
    e.stopPropagation()

    if (haveLoadAudio.current) {
      setisPlaying(!isPlaying)
      isPlaying ? audioDomRef.current.pause() : audioDomRef.current.play()
      return
    }

    const data = await request.get(`/unauthorize/newsDetail/audioUrlList/${newsId}`)

    if (data.resultCode === '0') {
      const { audioUrlList } = data.result
      haveLoadAudio.current = true
      let playIndex = 0
      audioDomRef.current.src = audioUrlList[playIndex]

      audioDomRef.current.addEventListener('ended', () => {
        if (playIndex >= audioUrlList.length - 1) {
          setisPlaying(false)
          return
        }
        playIndex += 1
        audioDomRef.current.src = audioUrlList[playIndex]
      }, false)

      audioDomRef.current.addEventListener('canplay', () => {
        if (!isPlaying) {
          setisPlaying(true)
        }
        audioDomRef.current.play()
      })
    }
  }

  return (
    <div className={styles.container}>

      <div className={styles['font-tab']}>
        <div className={styles['font-left']}>
          <Image
            src="/font-size.svg"
            alt=""
            width="26"
            height="26"
          />
          字号
        </div>


        <div className={styles['font-btn']}>
          <button
            className={classnames({[styles['active']]: currentFontSize === 'small'})}
            onClick={(e) => changeFontSize(e, 'small')}
          >
            小
          </button>
          <button
            className={classnames({[styles['active']]: currentFontSize === 'normal'})}
            onClick={(e) => changeFontSize(e, 'normal')}
          >
            标准
          </button>
          <button
            className={classnames({[styles['active']]: currentFontSize === 'large'})}
            onClick={(e) => changeFontSize(e, 'large')}
          >
            大
          </button>
        </div>
      </div>

      <article>
        <h3 className={classnames(styles.title, {
          [styles.fS20]: currentFontSize === 'small',
          [styles.fS22]: currentFontSize === 'normal',
          [styles.fS24]: currentFontSize === 'large',
        })}>{news.title}</h3>

        <div
          className={classnames(styles['author-box'], {
            [styles.fS12]: currentFontSize === 'small',
            [styles.fS14]: currentFontSize === 'normal',
            [styles.fS16]: currentFontSize === 'large',
          })}
        >
          <span>
            {
              news.issuingTime
            }
            {
              news.author
            }
          </span>
          <span>
            <audio hidden autoPlay ref={audioDomRef} />
            <button
              className={classnames({[styles['active']]: isPlaying})}
              onClick={onPlayAudio}
            >
              <div className={styles['play-ico']}>
                <Image
                  src={isPlaying ? '/playing-status.svg' : '/pause-status.svg'}
                  alt=""
                  layout="fill"
                />
              </div>
              朗读全文
            </button>
          </span>
        </div>

        <section dangerouslySetInnerHTML={{__html: news.contents}} ref={articleDomRef} />
      </article>
    </div>
  )
}

const getClientName = (ua) => {
  if (ua.indexOf('yugeyiliao') >= 0) {
    return 'app'
  } else if (ua.indexOf('micromessenger') > -1) {
    return 'wechat'
  } else {
    return 'other'
  }
}

export async function getServerSideProps(context) {
  // 获取useragent
  const ua = context.req.headers['user-agent']?.toLowerCase()

  const clientName = getClientName(ua)

  const {newsId} = context.params

  const data = await request.get(`https://m.yuge.com/unauthorize/newsDetail/id/${newsId}`)

  const {
    news,
  } = data.result

  if (typeof news === 'undefined') {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      title: news.title,
      desc: news.summary,
      keyword: news.keywords.map(item => item.name).join(','),
      news,
      clientName,
    },
  }
}

export default News
