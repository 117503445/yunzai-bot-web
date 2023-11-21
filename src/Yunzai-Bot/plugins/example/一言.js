import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'

export class example extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '一言',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#一言$',
          /** 执行方法 */
          fnc: 'hitokoto'
        }
      ]
    })
  }

  /**
   * #一言
   * @param e oicq传递的事件参数e
   */
  async hitokoto (e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)

    /** 一言接口地址 */
    let url = 'https://v1.hitokoto.cn/'
    /** 调用接口获取数据 */
    let res = await fetch(url).catch((err) => logger.error(err))

    /** 判断接口是否请求成功 */
    if (!res) {
      logger.error('[一言] 接口请求失败')
      return await this.reply('一言接口请求失败')
    }

    /** 接口结果，json字符串转对象 */
    res = await res.json()
    /** 输入日志 */
    logger.info(`[接口结果] 一言：${res.hitokoto}`)

    /** 最后回复消息 */
    await this.reply(`一言：${res.hitokoto}`)
  }
}
