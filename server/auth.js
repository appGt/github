const axios = require('axios')
const config = require('../config')

const { client_id, client_secret, requset_token_url } = config.github

module.exports = (server) => {
  server.use(async (ctx, next) => {
    if (ctx.path === '/auth') {
      const code = ctx.query.code
      if (!code) {
        return ctx.body = 'code not exist'
      }

      const result = await axios({
        method: 'POST',
        url: requset_token_url,
        data: {
          client_id,
          client_secret,
          code,
        },
        headers: {
          Accept: 'application/json'
        }
      })

      console.log(result.status, result.data)

      if (result.status === 200 && (result.data && !result.data.error)) {
        // 获取到的token保存在服务器的session中
        ctx.session.githubAuth = result.data
        const { token_type, access_token } = result.data
        const userInfoResp = await axios({
          method: 'GET',
          url: 'https://api.github.com/user',
          headers: {
            Authorization: `${token_type} ${access_token}`,
            Accept: 'application/json'
          }
        })

        ctx.session.user = userInfoResp.data

        ctx.redirect((ctx.session && ctx.session.urlBeforeOAuth) || '/')
        ctx.session.urlBeforeOAuth = ''
      } else {
        ctx.body = `request fail ${result.message}`
      }
    } else {
      await next()
    }
  })

  server.use(async (ctx, next) => {
    const { path, method } = ctx
    if (path == '/logout' && method == 'POST') {
      ctx.session = null
      ctx.body = 'logout success'
    } else {
      await next()
    }
  })

  server.use(async (ctx, next) => {
    const { path, method } = ctx
    if (path == '/prepare-auth' && method == 'GET') {
      const { url } = ctx.query
      ctx.session.urlBeforeOAuth = url
      // ctx.body = 'redy'
      ctx.redirect(config.OAUTH_URL)
    } else {
      await next()
    }
  })
}