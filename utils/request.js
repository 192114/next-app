import axios from 'axios'
import qs from 'qs'

const { CancelToken } = axios

const pending = new Map()

const addPending = (config) => {
  const { method, url, data, cancelToken } = config
  const request = [method, url, qs.stringify(data)].join('&')

  const newConfig = {
    ...config,
    cancelToken:
      cancelToken ||
      new CancelToken((cancel) => {
        if (!pending.has(request)) {
          pending.set(request, cancel)
        }
      }),
  }

  return newConfig
}

const removePending = (config) => {
  const { method, url, data } = config
  const request = [method, url, qs.stringify(data)].join('&')
  if (pending.has(request)) {
    const cancel = pending.get(request)
    cancel(request)
    pending.delete(request)
  }
}

export const clearPending = () => {
  const list = Object.entries(pending)

  let i = 0
  while (i < list.length) {
    const cur = list[i]
    const [request, cancel] = cur
    cancel(request)
    i += 1
  }

  pending.clear()
}

// 创建实例
const axiosInstance = axios.create({
  timeout: 10_000,
  transformRequest: [
    (data) => {
      if (Object.prototype.toString.call(data).toLowerCase() !== '[object object]') {
        return `data=${data}`
      }

      const nextData = {}
      Object.entries(data).forEach((item) => {
        const [key, value] = item
        if (Object.prototype.toString.call(value).toLowerCase() === '[object string]') {
          nextData[key] = encodeURIComponent(value)
        } else {
          nextData[key] = item
        }
      })

      return `data=${JSON.stringify(nextData)}`
    },
  ],
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    removePending(config)
    return addPending(config)
  },
  (err) => {
    // 清空所有请求
    clearPending()
    return Promise.reject(err)
  },
)

// 响应拦截
axiosInstance.interceptors.response.use(
  (res) => {
    removePending(res.config)

    const { data } = res

    return data
  },
  (err) => {
    if (axios.isCancel(err)) {
      throw new axios.Cancel('重复请求：请求已取消')
    }
    return Promise.reject(err)
  },
)

export default axiosInstance