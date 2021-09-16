const next = require('next')
const express = require('express')

const devProxy = {
  // '/api': {
  //   target: 'https://swapi.co/api/',
  //   pathRewrite: {'^/api': '/'},
  //   changeOrigin: true,
  // },
  '/unauthorize': {
    target: 'https://m.yuge.com',
    changeOrigin: true,
  },
  '/commWeixin': {
    target: 'https://m.yuge.com',
    changeOrigin: true,
  },
}

const port = parseInt(process.env.PORT, 10) || 3000
const env = process.env.NODE_ENV
const dev = env !== 'production'
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev,
})

const handle = app.getRequestHandler()

let server
app
  .prepare()
  .then(() => {
    server = express()

    // 在dev环境时候启动代理
    if (dev && devProxy) {
      const {createProxyMiddleware} = require('http-proxy-middleware')
      Object.keys(devProxy).forEach(function (context) {
        server.use(context, createProxyMiddleware(devProxy[context]))
      })
    }

    // 默认让next处理所有路由
    server.all('*', (req, res) => handle(req, res))

    server.listen(port, (err) => {
      if (err) {
        throw err
      }
      console.log(`> Ready on port ${port} [${env}]`)
    })
  })
  .catch((err) => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
  })