import express from 'express'
import cookieParser from 'cookie-parser'
import contentDisposition from 'content-disposition'
import { resolve } from 'node:path'

export class Middleware extends plugin {
  constructor () {
    super({
      name: '中间件',
      priority: 1,
      rule: [
        {
          method: 'use',
          use: 'middleware'
        },
        {
          method: 'use',
          path: '/download',
          use: 'staticDownload'
        }
      ]
    })
  }

  middleware () {
    return [
      cookieParser(),
      express.urlencoded({ limit: '500kb', extended: false }),
      express.json({ limit: '500kb' }),
      express.static(resolve('public'), { dotfiles: 'ignore', maxAge: '5m' })
    ]
  }

  staticDownload () {
    return express.static(resolve('public/.download'), {
      index: false,
      setHeaders: (res, path) => res.setHeader('Content-Disposition', contentDisposition(path))
    })
  }
}