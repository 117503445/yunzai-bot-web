import lodash from 'lodash'

let tmp = {}

export class GTest extends plugin {
  constructor () {
    super({
      name: 'GTest',
      dsc: '手动过码',
      route: '/GTest',
      rule: [
        {
          method: 'get',
          path: '/:key',
          fnc: 'index'
        },
        {
          method: 'get',
          path: '/validate/:key',
          fnc: 'result'
        },
        {
          method: 'get',
          path: '/register/:key',
          fnc: 'get_register'
        },
        {
          method: 'post',
          path: '/register',
          fnc: 'register'
        },
        {
          method: 'post',
          path: '/validate/:key',
          fnc: 'validate'
        }
      ]
    })
  }

  index () {
    let { key } = this.params
    if (!key || !tmp[key]) return this.error('验证信息不存在或已失效。')
    this.render('GTest/main', { key, copyright: this.cfg.Copyright })
  }

  register () {
    if (this.cfg.Key && this.query.key !== this.cfg.Key) return this._send(null, 'please enter the correct key')
    console.log(this.body)
    let { gt, challenge } = this.body || {}
    console.log(gt, challenge)
    if (!gt || !challenge) return this.error()
    let key = this.randomKey(6, tmp, { register: this.params })
    setTimeout(() => delete tmp[key], 150000)
    this._send({
      link: `${this.address}/${key}`,
      result: `${this.address}/validate/${key}`
    })
  }

  async result () {
    let { key } = this.params
    if (!key) return this.error()

    let data = null
    if (tmp[key]) {
      for (let i = 0; i < 240; i++) {
        let result = tmp[key]?.result
        if (result) {
          data = result
          break
        }
        await this.sleep(500)
      }
      if (!data) data = {}
      delete tmp[key]
    }
    this._send(data)
  }

  /** 浏览器返回Validate */
  validate () {
    let { key } = this.params
    if (!key || !tmp[key]) return this.error()
    tmp[key].result = this.body
    setTimeout(() => delete tmp[key], 30000)
    this._send({})
    logger.info(`[GTest] 验证成功, KEY: ${key}`)
  }

  /** 浏览器获取gt参数 */
  get_register () {
    let { key } = this.params
    if (!key || !tmp[key]) return this.error()
    let info = tmp[key].register
    if (!info) return this._send(null, '该验证信息已被使用，若非本人操作请重新获取')
    this.send(info)
    delete tmp[key].register
  }

  _send (data, message = 'OK') {
    return this.send({
      status: Number(!data),
      message,
      data
    })
  }

  get cfg () {
    return Server.cfg.getConfig('GTest')
  }

  get address () {
    let { Host, Key } = this.cfg
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