const express = require('express')
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')
// const setupDevServer = require('./build/setup-dev-server')

const server = express()

server.use('/dist', express.static('./dist'))

const isProd = process.env.NODE_ENV === 'production'

let renderer
let onReady
// if (isProd) {
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const template = fs.readFileSync('./index.template.html', 'utf-8')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  /**
   * 服务端如何渲染
   * 把 vue 实例注入 模板中
   * serverBundle : 执行的是 webpack.server.config.js 导出vue 实例 注入 template
   */
  /**
   * 客户端如何渲染
   * 把 vue 实例注入 模板中
   * clientManifest : 构建清单; 将 dist/vue-ssr-client-manifest.json/initial 中的资源 自动注入模板页面
   * dist/vue-ssr-client-manifest.json/async 存储异步资源信息
   * 所谓客户端激活，指的是 Vue 在浏览器端接管由服务端发送的静态 HTML，使其变为由 Vue 管理的动态 DOM 的过程。
   */
  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest
  })
// } else {
//   // 开发模式 -> 监视打包构建 -> 重新生成 Renderer 渲染器
//   onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
//     renderer = createBundleRenderer(serverBundle, {
//       template,
//       clientManifest
//     })
//   })
// }

const render = async (req, res) => {
  try {
    const html = await renderer.renderToString({
      title: '拉勾教育',
      meta: `
        <meta name="description" content="拉勾教育">
      `,
      url: req.url
    })
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  } catch (err) {
    console.log(err);
    res.status(500).end('Internal Server Error.')
  }
}

// 服务端路由设置为 *，意味着所有的路由都会进入这里
server.get('*', isProd
  ? render
  : async (req, res) => {
    // 等待有了 Renderer 渲染器以后，调用 render 进行渲染
    await onReady
    render(req, res)
  }
)

server.listen(3000, () => {
  console.log('server running at port 3000.')
})
