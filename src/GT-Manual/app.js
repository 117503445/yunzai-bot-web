import server from './lib/server.js'

/** 全局变量 Server */
global.Server = await server.run()