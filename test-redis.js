const Redis = require('ioredis')

const redis = new Redis({
  port: 6378,
  password: 'appgt',
})

async function test() {
  const keys = await redis.keys('*')
  console.log(keys)
}

test()