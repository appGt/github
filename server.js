const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const session = require('koa-session')
const Redis = require('ioredis')
const koaBody = require('koa-body')

const RedisSessionStore = require('./server/session-store')
const auth = require('./server/auth')
const api = require('./server/api')
const atob = require('atob')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const redis = new Redis()

global.atob = atob

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.keys = ['appgt dev']
  server.use(koaBody())
  const SESSION_CONFIG = {
    key: 'appid',
    store: new RedisSessionStore(redis),
  }

  server.use(session(SESSION_CONFIG, server))

  //手动对 GitHub OAuth 登录登出接口配置
  auth(server)
  //代理 Github api 请求在服务端添加token
  api(server)

  router.get('/a/:id', async (ctx) => {
    const id = ctx.params.id
    await handle(ctx.req, ctx.res, {
      pathname: '/a',
      query: { id }
    })
    ctx.respond = false
  })

  router.get('/api/user/info', async (ctx) => {
    const user = ctx.session.user
    if (!user) {
      ctx.status = 401
      ctx.body = 'Need Login'
    } else {
      ctx.body = user
      ctx.set('Content-Type', 'application/json')
    }
  })

  server.use(router.routes())

  server.use(async (ctx, next) => {
    ctx.req.session = ctx.session
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => {
    console.log('Koa server listening on 3000')
  })
})