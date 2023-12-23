import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import multer from 'multer'
import rateLimit from 'express-rate-limit'

export default class plugin {
  /**
   * @param name 插件名称
   * @param dsc 插件描述
   * @param priority 插件优先级
   * @param rule.method 请求方法
   * @param rule.path 请求路径
   * @param rule.use 请求处理
   * @param rule.fnc 请求处理
   */
  constructor (data = {}) {
    /** 插件名称 */
    this.name = data.name || ''
    /** 插件描述 */
    this.dsc = data.dsc || ''
    /** 插件优先级 */
    this.priority = data.priority || 5
    /** 插件优先级 */
    this.route = data.route || ''
    /** 定时任务，可以是数组 */
    this.task = {
      /** 任务名 */
      name: '',
      /** 任务方法名 */
      fnc: data.task?.fnc || '',
      /** 任务cron表达式 */
      cron: data.task?.cron || ''
    }
    /** 命令规则 */
    this.rule = data.rule || []
  }

  /** 读json */
  readJson (filePath, format = 'json') {
    try {
      if (format == 'yaml') {
        return YAML.parse(fs.readFileSync(filePath, 'utf8'))
      }
      return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (err) {
      return false
    }
  }

  /** 写json */
  writeJson (savePath, data, format = 'json') {
    this.mkdir(path.dirname(savePath))
    if (format == 'yaml') return fs.writeFileSync(savePath, YAML.stringify(data))
    return fs.writeFileSync(savePath, JSON.stringify(data, null, 2))
  }

  /** 创建文件夹 */
  mkdir (dirname) {
    if (fs.existsSync(dirname)) {
      return true
    } else {
      if (this.mkdir(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
      }
    }
  }

  /** 休眠函数 */
  sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /** 速率限制 */
  limiter (limit = 15, cd = 60, options = {}) {
    options = {
      limit: limit,
      windowMs: cd * 1000,
      legacyHeaders: false,
      message: { status: 1, message: 'Frequent requests, please try again later' },
      ...options
    }
    return rateLimit(options)
  }

  /** 文件上传, single, array, any */
  upload (savaPath = './public/upload', filename, options = {}) {
    options = {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, savaPath)
        },
        filename: filename || ((req, file, cb) => {
          cb(null, Date.now() + path.extname(file.originalname))
        })
      }),
      limits: { fileSize: 5 * 1024 * 1024, files: 1 },
      ...options
    }
    return multer(options)
  }
}
