import PluginsLoader from './loader.js'
import Plugin from '../plugin.js'
import application from './application.js'
import { WebSocketServer } from 'ws'
import util from 'node:util'
import path from 'node:path'
import http from 'node:http'
import https from 'node:https'

export default class ListenerLoader extends PluginsLoader {
  constructor () {
    global.plugin = Plugin
    super()
  }

  static create (args) {
    let cfg = args.cfg
    if (!cfg.http.HTTPS) {
      args.server = http.createServer(args.app)
    } else {
      args.server = https.createServer(cfg.cert, args.app)
      if (cfg.http.HTTP_TO_HTTPS) {
        http.createServer((req, res) => {
          res.writeHead(307, {
            'Location': cfg.https_address(req.url, req.headers.host)
          }).end()
        }).listen(cfg.http.HTTP_PORT)
      }
    }
    args.handler = application.Handle(args.app)
    args.wss = new WebSocketServer({ server: args.server })
    return Object.assign(new ListenerLoader(), args)
  }

  async run () {
    this.wss.on('error', logger.error)
    this.wss.on('connection', (socket, request) => {
      if ('upgradeReq' in socket) {
        request = socket.upgradeReq
      }
      request.ws = socket
      request.url = this.handler.WebSocketUrl(request.url)
      this.handler.call(request.url.split('?')[0], [socket, request], () => {
        if (!request.wsHandled) socket.close()
      })
    })
    await this.pluginsLoader()
    await this.addListener()
    this.server.listen(...this.cfg.http_listen)
  }

  async addListener () {
    this.cfg.paths = {}
    for (let plugin of this.priority) {
      if (plugin.rule) {
        for (let v of plugin.rule) {
          let middlewares = []

          let path = ((plugin.self.route || '') + (v.path || '')) || '/'

          if (v.use) {
            if (typeof v.use == 'string' && plugin.self[v.use]) {
              let result = await plugin.self[v.use]()
              if (result) {
                if (!util.isArray(result)) {
                  result = [result]
                }
                middlewares.push(...result)
              }
            } else if (util.isArray(v.use)) {
              v.use.forEach(fn => {
                if (fn && plugin.self[fn]) {
                  middlewares.push(plugin.self[fn])
                }
              })
            }
          }

          if (v.fnc && plugin.self[v.fnc]) {
            if (v.method == 'ws') {
              middlewares.push(this.WebSocketEvent(plugin, v.fnc))
            } else {
              middlewares.push(this.HttpRequestEvent(plugin, v.fnc))
            }
          }

          this.app[v.method](path, middlewares)
        }
      }
    }
  }

  HttpRequestEvent (plugin, fnc) {
    return async (req, res, next) => {
      let p = (this.priority.find(val => val.key == plugin.key))?.class
      if (!p) return res.send({ status: 1, message: 'Error occurred!' })
      let t = {
        req, res, next,
        param: req.params,
        query: req.query,
        cookie: req.cookies,
        body: req.body,
        end: res.end,
        send: (data, status) => res.status(status || 200).send(data),
        error: (msg, status) => res.status(status || 200).send({ status: 1, message: msg || 'Invalid request' }),
        render: res.render
      }
      t.params = Object.assign({}, t.param, t.query, t.body, t.cookie)
      let self = Object.assign(new p(), t)
      try {
        let res = self[fnc] && self[fnc]()
        if (util.types.isPromise(res)) {
          res = await res
        }
      } catch (err) {
        if (err) logger.error(err)
      }
    }
  }

  WebSocketEvent (plugin, fnc) {
    return async (socket, request, next) => {
      let p = (this.priority.find(val => val.key == plugin.key))?.class
      if (!p) return socket.close()
      let t = {
        socket, request, next,
        send: (...args) => socket.send(...args),
        close: () => socket.close(),
        onMessage: (fn, on = 'on') => socket[on]('message', fn),
        onClose: (fn, on = 'on') => socket[on]('close', fn),
        onError: (fn, on = 'on') => socket[on]('error', fn)
      }
      let self = Object.assign(new p(), t)
      self.onError(logger.error)
      try {
        let res = self[fnc] && self[fnc]()
        if (util.types.isPromise(res)) {
          res = await res
        }
      } catch (err) {
        if (err) logger.error(err)
      }
    }
  }
}