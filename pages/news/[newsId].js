import React, { useRef, useState, useEffect } from "react"
import Image from "next/image"
import classnames from "classnames"
import { useRouter } from "next/dist/client/router"

import WithBackNative from "../../components/WithBackNative"
import HotArticleList from "../../components/HotArticleList"
import request from "../../utils/request"
import styles from "../../styles/Home.module.css"

const News = ({ news, articleUrl, clientName, deviceTypeName }) => {
  const router = useRouter()
  const { newsId } = router.query

  const articleDomRef = useRef(null)
  const audioDomRef = useRef(null)
  const haveLoadAudio = useRef(false)
  const reportReasonDomRef = useRef(null)

  const [currentFontSize, setCurrentFontSize] = useState("normal")
  const [isPlaying, setisPlaying] = useState(false)
  const [isMyLike, setIsMyLike] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [reportMaskShow, setReportMaskShow] = useState(false)

  useEffect(() => {
    if (clientName === "wechat") {
      const getWxConfigRes = async () => {
        const data = await request.post("/commWeixin/getSignature", {
          url: articleUrl,
        })
        if (data.resultCode === "0") {
          const { timestamp, nonceStr, signature } = data.result

          wx.config({
            debug: true,
            appId: "wxb25b6a530fffb318", // 必填，公众号的唯一标识
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature, // 必填，签名
            jsApiList: [
              "updateAppMessageShareData", // 分享朋友圈
              "updateTimelineShareData", // 分享好友
            ], // 必填，需要使用的JS接口列表
            openTagList: ["wx-open-launch-app"],
          })
        }
      }

      getWxConfigRes()
    }
  })

  const changeFontSize = (e, cur) => {
    e.stopPropagation()

    if (cur === currentFontSize) {
      return
    }

    const allDom = articleDomRef.current.querySelectorAll("span")
    Array.from(allDom).forEach((item) => {
      const preFontSize = parseInt(item.style.fontSize, 10)

      let step = 0
      if (
        (currentFontSize === "small" && cur === "normal") ||
        (currentFontSize === "normal" && cur === "large")
      ) {
        step = 2
      }

      if (currentFontSize === "small" && cur === "large") {
        step = 4
      }

      if (
        (currentFontSize === "normal" && cur === "small") ||
        (currentFontSize === "large" && cur === "normal")
      ) {
        step = -2
      }

      if (currentFontSize === "large" && cur === "small") {
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

    const data = await request.get(
      `/unauthorize/newsDetail/audioUrlList/${newsId}`
    )

    if (data.resultCode === "0") {
      const { audioUrlList } = data.result
      haveLoadAudio.current = true
      let playIndex = 0
      audioDomRef.current.src = audioUrlList[playIndex]

      audioDomRef.current.addEventListener(
        "ended",
        () => {
          if (playIndex >= audioUrlList.length - 1) {
            setisPlaying(false)
            return
          }
          playIndex += 1
          audioDomRef.current.src = audioUrlList[playIndex]
        },
        false
      )

      audioDomRef.current.addEventListener("canplay", () => {
        if (!isPlaying) {
          setisPlaying(true)
        }
        audioDomRef.current.play()
      })
    }
  }

  const onChangeMyLike = async (e) => {
    e.stopPropagation()

    const param = {
      articleId: newsId,
      articleType: 'news',
    }

    const data = await request.post('/unauthorize/commentH5/likeOrCancelLike', param)

    if (data.resultCode === 0) {
      const {likeCount: lCount} = data.data
      setLikeCount(lCount)
      setIsMyLike(!isMyLike)
    }

  }

  const onReport = (e) => {
    e.preventDefault()
    if (reportReasonDomRef.current) {
      reportReasonDomRef.current.value = ''
    }
    setReportMaskShow(true)
  }

  const onSureReport = async (e) => {
    e.preventDefault()

    const description = reportReasonDomRef.current.value

    if (!description) {
      window.alert('请输入反馈内容！')
      return
    }

    const param = {
      id: newsId,
      type: '2',
      description,
    }

    const data = await request.post('/unauthorize/commentH5/articleTip', param)

    if (data.resultCode === '0') {
      window.alert('感谢反馈！')
    }

    setReportMaskShow(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles["font-tab"]}>
        <div className={styles["font-left"]}>
          <Image src="/font-size.svg" alt="" width="26" height="26" />
          字号
        </div>

        <div className={styles["font-btn"]}>
          <button
            className={classnames({
              [styles["active"]]: currentFontSize === "small",
            })}
            onClick={(e) => changeFontSize(e, "small")}
          >
            小
          </button>
          <button
            className={classnames({
              [styles["active"]]: currentFontSize === "normal",
            })}
            onClick={(e) => changeFontSize(e, "normal")}
          >
            标准
          </button>
          <button
            className={classnames({
              [styles["active"]]: currentFontSize === "large",
            })}
            onClick={(e) => changeFontSize(e, "large")}
          >
            大
          </button>
        </div>
      </div>

      <article>
        <h3
          className={classnames(styles.title, {
            [styles.fS20]: currentFontSize === "small",
            [styles.fS22]: currentFontSize === "normal",
            [styles.fS24]: currentFontSize === "large",
          })}
        >
          {news.title}
        </h3>

        <div
          className={classnames(styles["author-box"], {
            [styles.fS12]: currentFontSize === "small",
            [styles.fS14]: currentFontSize === "normal",
            [styles.fS16]: currentFontSize === "large",
          })}
        >
          <span>
            {news.issuingTime}
            {news.author}
          </span>
          <span>
            <audio hidden autoPlay ref={audioDomRef} />
            <button
              className={classnames({ [styles["active"]]: isPlaying })}
              onClick={onPlayAudio}
            >
              <div className={styles["play-ico"]}>
                <Image
                  src={isPlaying ? "/playing-status.svg" : "/pause-status.svg"}
                  alt=""
                  layout="fill"
                />
              </div>
              朗读全文
            </button>
          </span>
        </div>

        <section
          dangerouslySetInnerHTML={{ __html: news.contents }}
          ref={articleDomRef}
        />

        <section className={styles["article-foot"]}>
          <span>来源：{news.provenance}</span>
          <span>阅读（{news.viewCount}）</span>
        </section>

        <section className={styles["article-ops"]}>
          <div>
            <WithBackNative
              clientName={clientName}
              articleUrl={articleUrl}
              onClick={onChangeMyLike}
              deviceTypeName={deviceTypeName}
            >
              <div className={styles['zan-box']}>
                <div
                  className={classnames(styles.heart, {
                    [styles.active]: isMyLike,
                  })}
                />
                <div>
                  （{likeCount}）
                </div>
              </div>
            </WithBackNative>
          </div>

          <div>
            <WithBackNative
              clientName={clientName}
              articleUrl={articleUrl}
              onClick={onReport}
              deviceTypeName={deviceTypeName}
            >
              <button className={styles["report-btn"]}>
                <div>
                  <Image src="/warn.svg" alt="" width="20" height="20" />
                </div>
                举报
              </button>
            </WithBackNative>
          </div>
        </section>

        <HotArticleList articleId={newsId} />
      </article>

      {/* 投诉建议mask  */}
      {
        reportMaskShow && (
          <section className={styles['report-mask']}>
            <div className={styles['report-mask-content']}>
              <div className={styles['report-mask-title']}>
                <span>反馈</span>
                <button
                  className={styles['report-mask-title-right']}
                  onClick={() => setReportMaskShow(false)}
                >
                  <Image 
                    src="/close.svg"
                    alt=""
                    layout="fill"
                  />
                </button>
                
              </div>

              <textarea 
                placeholder="请输入反馈内容"
                ref={reportReasonDomRef}
              />

              <button 
                className={styles['report-mask-btn']}
                onClick={onSureReport}
              >
                确定
              </button>
            </div>
          </section>
        )
      }
    </div>
  )
}

const getClientName = (ua) => {
  if (ua.indexOf("yugeyiliao") >= 0) {
    return "app"
  } else if (ua.indexOf("micromessenger") > -1) {
    return "wechat"
  } else {
    return "other"
  }
}

const getDeviceTypeName = (ua) => {
  const isAndroid = ua.indexOf("Android") > -1 || ua.indexOf("Adr") > -1 //判断是否是 android终端
  const isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //判断是否是 iOS终端

  if (isAndroid) {
    return "android"
  }

  if (isIOS) {
    return "ios"
  }

  return null
}

export async function getServerSideProps(context) {
  // 获取useragent
  const ua = context.req.headers["user-agent"]
  const uaLower = ua?.toLowerCase()
  const articleUrl = context.req.headers["referer"]

  const clientName = getClientName(uaLower)
  const deviceTypeName = getDeviceTypeName(ua)

  const { newsId } = context.params

  const data = await request.get(
    `https://m.yuge.com/unauthorize/newsDetail/id/${newsId}`
  )

  const { news } = data.result

  console.log(news)

  if (typeof news === "undefined") {
    return {
      notFound: true,
      props: {
        clientName,
        articleUrl,
        deviceTypeName,
        isNotFound: true,
      }
    }
  }

  return {
    props: {
      title: news.title,
      desc: news.summary,
      keyword: news.keywords.map((item) => item.name).join(","),
      news,
      clientName,
      articleUrl,
      deviceTypeName,
      isNotFound: false,
    },
  }
}

export default News
