import chokidar from 'chokidar'
import moment from 'moment'
import fs from 'node:fs'
import lodash from 'lodash'

class PluginsLoader {
  constructor () {
    this.priority = []
    this.task = []
    this.watcher = {}
    this.dir = './plugins'
  }

  async pluginsLoader () {
    const files = this.getPlugins()

    logger.info('加载插件中..')

    let pluCount = 0

    let packageErr = []
    for (let File of files) {
      try {
        let tmp = await import(File.path)
        if (tmp.apps) tmp = { ...tmp.apps }
        let isAdd = false
        lodash.forEach(tmp, (p, i) => {
          if (!p.prototype) {
            return
          }
          /* eslint-disable new-cap */
          let plugin = new p()
          if (!plugin.priority) return
          isAdd = true
          logger.debug(`载入插件 [${plugin.name}]`)
          /** 执行初始化 */
          this.runInit(plugin)
          /** 初始化定时任务 */
          this.collectTask(plugin.task)
          this.priority.push({
            class: p,
            key: File.name,
            self: plugin,
            name: plugin.name,
            protocol: plugin.protocol || 'http',
            priority: plugin.priority,
            rule: plugin.rule
          })
        })

        if (isAdd) pluCount++
      } catch (error) {
        if (error.stack.includes('Cannot find package')) {
          packageErr.push({ error, File })
        } else {
          logger.error(`载入插件错误：${File.name}`)
          logger.error(decodeURI(error.stack))
        }
      }
    }

    this.packageTips(packageErr)
    this.creatTask()
    this.priority = lodash.orderBy(this.priority, ['priority'], ['asc'])
    logger.info(`加载定时任务[${this.task.length}个]`)
    logger.info(`加载插件完成[${pluCount}个]`)
    logger.info(`-----------`)
  }

  getPlugins () {
    let ignore = ['index.js']
    let files = fs.readdirSync(this.dir, { withFileTypes: true })
    let ret = []
    for (let val of files) {
      let filepath = '../../plugins/' + val.name
      let tmp = {
        name: val.name
      }
      if (val.isFile()) {
        if (!val.name.endsWith('.js')) continue
        if (ignore.includes(val.name)) continue
        tmp.path = filepath
        ret.push(tmp)
        continue
      }

      if (fs.existsSync(`${this.dir}/${val.name}/index.js`)) {
        tmp.path = filepath + '/index.js'
        tmp.name = val.name + '/index.js'
        ret.push(tmp)
        continue
      }

      let apps = fs.readdirSync(`${this.dir}/${val.name}`, { withFileTypes: true })
      for (let app of apps) {
        if (!app.name.endsWith('.js')) continue
        if (ignore.includes(app.name)) continue

        ret.push({
          name: `${val.name}/${app.name}`,
          path: `../../plugins/${val.name}/${app.name}`
        })

        continue
      }
    }

    /** 监听热更新 */
    ret.forEach(v => {
      this.watch(v.name, v.path)
    })

    return ret
  }

  async runInit (plugin) {
    plugin.init && plugin.init()
  }

  packageTips (packageErr) {
    if (!packageErr || packageErr.length <= 0) return
    logger.mark('--------插件载入错误--------')
    packageErr.forEach(v => {
      let pack = v.error.stack.match(/'(.+?)'/g)[0].replace(/'/g, '')
      logger.mark(`${v.File.name} 缺少依赖：${logger.red(pack)}`)
      logger.mark(`请执行安装依赖命令：${logger.red('pnpm add ' + pack + ' -w')}`)
    })
    logger.mark('---------------------')
  }

  /** 收集定时任务 */
  collectTask (task) {
    if (Array.isArray(task)) {
      task.forEach((val) => {
        if (!val.cron) return
        if (!val.name) throw new Error('插件任务名称错误')
        this.task.push(val)
      })
    } else {
      if (task.fnc && task.cron) {
        if (!task.name) throw new Error('插件任务名称错误')
        this.task.push(task)
      }
    }
  }

  /** 创建定时任务 */
  creatTask () {
    this.task.forEach((val) => {
      val.job = schedule.scheduleJob(val.cron, async () => {
        try {
          if (val.log === true) {
            logger.mark(`开始定时任务：${val.name}`)
          }
          let res = val.fnc()
          if (util.types.isPromise(res)) res = await res
          if (val.log === true) {
            logger.mark(`定时任务完成：${val.name}`)
          }
        } catch (error) {
          logger.error(`定时任务报错：${val.name}`)
          logger.error(error)
        }
      })
    })
  }

  /** 监听热更新 */
  watch (appName, appPath) {
    if (this.watcher[`${appName}`]) return

    let file = `./plugins/${appName}`
    const watcher = chokidar.watch(file)
    let key = appName

    /** 监听修改 */
    watcher.on('change', async path => {
      logger.mark(`[修改插件][${appName}]`)

      let tmp = {}
      try {
        tmp = await import(`${appPath}?${moment().format('x')}`)
      } catch (error) {
        logger.error(`载入插件错误：${logger.red(appName)}`)
        logger.error(decodeURI(error.stack))
        return
      }

      if (tmp.apps) tmp = { ...tmp.apps }
      lodash.forEach(tmp, (p) => {
        /* eslint-disable new-cap */
        let plugin = new p()
        for (let i in this.priority) {
          if (this.priority[i].key == key) {
            this.priority[i].class = p
            this.priority[i].rule = plugin.rule
          }
        }
      })
    })

    this.watcher[`${appName}`] = watcher
  }
}
export default PluginsLoader