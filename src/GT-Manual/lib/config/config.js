import YAML from 'yaml'
import fs from 'node:fs'
import chokidar from 'chokidar'

/** 配置文件 */
class Cfg {
  /** 初始化配置 */
  constructor () {
    let file = 'config/config.yaml'
    let fileDef = 'config/default_config.yaml'
    if (!fs.existsSync(file)) {
      fs.copyFileSync(fileDef, file)
    }
    if (!fs.existsSync('data')) fs.mkdirSync('data')
    this.config = {}
  }

  get http () {
    return this.getConfig('config')
  }

  get http_listen () {
    return [this.http.HTTPS ? this.http.HTTPS_PORT : this.http.HTTP_PORT, this.http.HOST]
  }

  https_address (originalUrl, hostname) {
    let Url = new URL(originalUrl, `https://${hostname}`)
    Url.port = this.http.HTTPS_PORT
    return Url.href
  }

  get redis () {
    return this.getConfig('redis')
  }

  get cert() {
    return {
      cert: fs.readFileSync(this.http.CA_CERTIFICATE, 'utf8'),
      key: fs.readFileSync(this.http.CA_PRIVATE, 'utf8')
    }
  }

  /** package.json */
  get package () {
    if (this._package) return this._package

    this._package = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    return this._package
  }

  /** 用户配置 */
  getConfig (name) {
    return this.getYaml(name)
  }

  /**
   * 获取配置yaml
   * @param type 默认跑配置-defSet，用户配置-config
   * @param name 名称
   */
  getYaml (name) {
    let file = `config/${name}.yaml`
    if (this.config[name]) return this.config[name]

    this.config[name] = YAML.parse(
      fs.readFileSync(file, 'utf8')
    )

    return this.config[name]
  }
}

export default new Cfg()
