import './config/init.js'
import ListenerLoader from './loader/listener.js'
import cfg from './config/config.js'
import express from 'express'

export default class Server {
  constructor (app) {
    /** Express */
    this.app = app
    this.cfg = cfg
  }

  static async run () {
    let server = new Server(express())
    await ListenerLoader.create(server).run()
    return server
  }
}