const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
const client_id = '80fa71eb01f313fe01ca'

module.exports = {
  github: {
    requset_token_url: 'https://github.com/login/oauth/access_token',
    client_id,
    client_secret: '42e0c83347dba1883a26838cdba5f3ab1fd16372',
  },
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`,
  SCOPE,
}