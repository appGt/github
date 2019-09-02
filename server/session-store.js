function getRedisSessionId(sid) {
  return `ssid:${sid}`
}

class RedisSessionStore {
  constructor(client) {
    this.client = client
  }

  // 获取Redis中存储的session数据
  async get(sid) {
    const id = getRedisSessionId(sid)
    const data = await this.client.get(id)
    if (!data) {
      return null
    }
    try {
      const result = JSON.parse(data)
      return result
    } catch (err) {
      console.log(err)
    }
  }

  // 存储session数据到redis
  async set(sid, session, ttl) {
    const id = getRedisSessionId(sid)
    if (typeof ttl === 'number') {
      ttl = Math.ceil(ttl / 1000)
    }
    try {
      const sessionStr = JSON.stringify(session)
      if (ttl) {
        await this.client.setex(id, ttl, sessionStr)
      } else {
        await this.client.set(id, sessionStr)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 从redis当中删除某个session
  async destroy(sid) {
    const id = getRedisSessionId(sid)
    await this.client.del(id)
  }
}

module.exports = RedisSessionStore