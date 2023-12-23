import setLog from './log.js'
import cfg from "./config.js"
import redisInit from './redis.js'
import { checkRun } from './check.js'
import fs from 'node:fs'

/** 设置标题 */
process.title = cfg.package.name
/** 设置时区 */
process.env.TZ = 'Asia/Shanghai'

/** 捕获未处理的错误 */
process.on('uncaughtException', (error) => {
  let err = error
  if (logger) {
    logger.error(err)
  } else {
    console.log(err)
  }
})

/** 捕获未处理的Promise错误 */
process.on('unhandledRejection', (error, promise) => {
  let err = error
  if (logger) {
    logger.error(err)
  } else {
    console.log(err)
  }
})

/** 退出事件 */
process.on('exit', async (code) => {
  if (typeof redis != 'undefined' && typeof test == 'undefined') {
    await redis.save()
  }
})

await checkInit()

/** 初始化事件 */
async function checkInit () {
  /** 检查node_modules */
  if (!fs.existsSync('./node_modules') || !fs.existsSync('./node_modules/express')) {
    console.log('请先pnpm install -P安装')
    process.exit()
  }

  /** 日志设置 */
  setLog()

  await redisInit()

  await checkRun()

  logger.info(`${cfg.package.name} 启动中...`)
}
