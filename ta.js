const Axios = require("axios");

async function getData() {
  const result = await Axios.get('https://api.github.com/search/repositories?q=koa&per_page=20')
  return result
}

console.time('start')

getData().then(resp => {
  console.log(resp.data)
  console.timeEnd('start')

}).catch(err => {
  console.log(err)
})