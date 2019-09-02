const Axios = require('axios')
const moment = require('moment')

const github_base_url = 'https://api.github.com'

async function requestGithub(method, url, data, headers) {
  console.log(`${method} ${github_base_url}${url} ${moment(new Date()).format('hh:mm:ss')}`)
  const result = await Axios({
    method,
    url: `${github_base_url}${url}`,
    data,
    headers,
  })
  console.log(`${method} ${github_base_url}${url} ${moment(new Date()).format('hh:mm:ss')} success`)
  return result
}

const isServer = typeof window === 'undefined'
async function request({ method = 'GET', url, data }, req, res) {
  if (!url) {
    throw Error('url must provider')
  }
  if (isServer) {
    const session = req.session
    const githubAuth = session.githubAuth || {}
    const headers = {}
    if (githubAuth.access_token) {
      headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
    }
    return await requestGithub(method, url, data, headers)
  } else {
    // /github/search/respos
    return await Axios({
      method,
      url: `/github${url}`,
      data,
    })
  }
}

module.exports = {
  request,
  requestGithub,
}