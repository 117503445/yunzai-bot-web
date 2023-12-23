import lodash from 'lodash'
import md5 from 'md5'

let _connection = {}

export class MysSign extends plugin {
  constructor () {
    super({
      name: 'mysSign',
      dsc: 'mys签到',
      route: '/mysSign',
      rule: [
        {
          method: 'get',
          path: '/:key',
          fnc: 'index'
        },
        {
          method: 'get',
          path: '/:key/:uid',
          fnc: 'bbsSign'
        },
        {
          method: 'post',
          path: '/:key/:uid',
          fnc: 'bbsSign'
        },
        {
          method: 'ws',
          path: '/',
          fnc: 'connection'
        }
      ]
    })
  }

  index () {
    let { key } = this.params
    let user = this.findUser(key)
    if (!user) {
      this.error('UID列表不存在或已失效')
      return
    }
    this.render('mysSign/main', { key, user, copyright: this.cfg.Copyright })
  }

  async bbsSign () {
    let { connect, id, key, uid, validate } = this.params
    if (!validate && this.params['validate[geetest_validate]']) {
      validate = {
        geetest_challenge: this.params['validate[geetest_challenge]'],
        geetest_validate: this.params['validate[geetest_validate]'],
        geetest_seccode: this.params['validate[geetest_seccode]'],
      }
    }
    connect = _connection[connect]
    let user = connect[key]
    let uidData = user?.uids.find(v => v.uid == uid)
    if (!uidData) {
      this.send({ msg: '签到失败：链接已失效，请重新获取' })
      return
    }
    let data = uidData.status
    if (!data) {
      data = await connect.self.socketSend('doSign', { id, validate, ...uidData }, md5(`${new Date().getTime()}${uid}`))
      if (data.retcode == 0) {
        uidData.status = { ...data, msg: data.msg.replace('签到成功', '今天已签到') }
        logger.info(`[mysSign] 签到成功, UID: ${uid}`)
      }
    }
    this.send(data)
  }

  connection () {
    if (this.cfg.Key && this.request.query.key !== this.cfg.Key) return this.close()
    this._wait = this._wait || {}
    this._key = this.randomKey(10, _connection)
    this.onClose(() => delete _connection[this._key])
    this.onMessage((data) => {
      try {
        data = JSON.parse(data)
        let { id, cmd, payload, key } = data
        this._wait[id] && this._wait[id](payload) || this[cmd] && this[cmd](payload, id)
      } catch (err) {
        logger.error(err)
      }
    })
  }

  async createUser (data, id) {
    let connect = _connection[this._key]
    if (!connect.self) {
      connect.self = this
    }
    let key = this.hasUser(id)
    if (!key) {
      key = this.randomKey(6, connect, { connect: this._key, id, uids: data })
      /** uid缓存10分钟 */
      setTimeout(() => connect && delete connect[key], 600 * 1000)
    }
    let payload = { link: `${this.address}/${key}` }
    this.socketWrite('createUser', payload, id)
  }

  hasUser (id) {
    let ret = false
    lodash.forEach(_connection, (connect) => {
      lodash.forEach(connect, (user, key) => {
        if (user.id == id) {
          ret = key
          return false
        }
      })
    })
    return ret
  }

  findUser (key) {
    let ret = false
    let connect = this.findConnect(key)
    if (connect) ret = connect[key]
    return ret
  }

  findConnect (key) {
    let ret = false
    if (key) {
      lodash.forEach(_connection, (connect) => {
        if (connect[key]) {
          ret = connect
          return false
        }
      })
    }
    return ret
  }

  socketWrite (cmd, payload, id) {
    if (!id || typeof id == 'number' && String(id).length == 13) id = new Date().getTime()
    return this.socket.send(JSON.stringify({ id, cmd, payload, key: this._key }))
  }

  socketSend (cmd, payload, id) {
    return new Promise((resolve, reject) => {
      this.socketWrite(cmd, payload, `${id}`)
      this._wait[id] = resolve
      setTimeout(() => resolve(false) && delete this._wait[id], 5 * 1000)
    })
  }

  get cfg () {
    return Server.cfg.getConfig('GTest')
  }

  get address () {
    let { Host } = this.cfg
    let protocol = Server.cfg.http.HTTPS ? 'https' : 'http'
    let port = Server.cfg.http_listen[0]
    if (![80, 443].includes(port)) Host += `:${port}`
    return `${protocol}://${Host}${this.route}`
  }

  randomKey (length, checkObj, data) {
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let key = lodash.sampleSize(letters, length).join('')
    while (checkObj[key]) {
      key = lodash.sampleSize(letters, length).join('')
    }
    checkObj[key] = data || {}
    return key
  }
}