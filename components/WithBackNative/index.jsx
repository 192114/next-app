import React, { useRef, useEffect } from "react"

const WithBackNative = ({
  clientName,
  onClick,
  children,
  articleUrl,
  deviceTypeName,
}) => {
  const wxWrapId = useRef(`wx-wrap-${new Date().getTime()}`)

  useEffect(() => {
    if (clientName === "wechat") {
      const targetDom = document.querySelector(`#${wxWrapId.current}`)

      const errorHandler = () => {
        window.location.href = "https://www.yuge.com/yg2code.html"
      }
      targetDom.addEventListener("error", errorHandler)

      return () => {
        targetDom.removeEventListener("error", errorHandler)
      }
    }
  }, [clientName])

  const getExtInfo = () => {
    const u = navigator.userAgent
    const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1 //判断是否是 android终端
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //判断是否是 iOS终端

    let param = {}

    if (isAndroid) {
      param = {
        className: "com.yuge.yixin.ActivityUtils",
        methodName: "startCustomWebView",
        ext01: {
          key: "mActivity",
          type: "Class",
          value: "android.content.Context",
        },
        ext02: { key: "customTitle", type: "String", value: "" },
        ext03: { key: "url", type: "String", value: encodeURI(articleUrl) },
      }
    }

    if (isIOS) {
      param = { url: articleUrl }
    }

    return JSON.stringify(param)
  }

  const getSchemeUrl = () => {
    let url = ""

    // 直接打开url 让用户选择打开的app
    if (deviceTypeName === "android") {
      url = `yugeapp://m.yuge.com/qrcode/url/action/redirect.htm?data=${JSON.stringify(
        { url: encodeURIComponent(articleUrl) }
      )}`
    }

    if (deviceTypeName === "ios") {
      url = `https://www.yuge.com/yugemedical/appointPage?${JSON.stringify({
        url: encodeURIComponent(articleUrl),
      })}`
    }

    return url
  }

  // app 端
  if (clientName === "app") {
    return onClick
      ? React.cloneElement(children, {
          onClick,
        })
      : children
  }

  // 微信端
  if (clientName === "wechat") {
    const extinfo = getExtInfo()
    return (
      <>
        {children}
        <wx-open-launch-app
          appId="wx485802d984dc560f"
          extinfo={extinfo}
          id={wxWrapId.current}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
          }}
        >
          <script type="text/wxtag-template">
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </script>
        </wx-open-launch-app>
      </>
    )
  }

  // 如果为其他客户端 则尝试用scheme打开app
  if (clientName === "other") {
    const schemeUrl = getSchemeUrl()
    return React.cloneElement(children, {
      onClick: () => {
        window.location.href = schemeUrl

        // 判断app是否安装  如果页面hidden 或者  不可见 就认为跳转成功 （如果用户将浏览器切到后台 也会触发）
        // 注：此方法不准确
        const timer = window.setTimeout(() => {
          // 失败回调
          window.location.href = "https://www.yuge.com/yg2code.html"
        }, 5000)

        const successHandler = () => {
          if (document.hidden) {
            clearTimeout(timer)
          }
        }

        window.addEventListener("blur", successHandler, { once: true })
        window.addEventListener("visibilitychange", successHandler, {
          once: true,
        })
      },
    })
  }

  return null
}

export default WithBackNative
