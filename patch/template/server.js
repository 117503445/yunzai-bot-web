import '../config/init.js'
import PluginsLoader from '../plugins/loader.js'
import Fastify from 'fastify'

import * as fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid';

fs.mkdir('./data/server', { recursive: true })

global.Bot = {}
await PluginsLoader.load()

const fastify = Fastify({
    logger: true
})

fastify.post('/api/chat', async (request, reply) => {
    reply.type('application/json').code(200)

    let e = request.body

    let data = []

    e.group.sendMsg = (msg) => {
        logger.info(`group 回复内容 ${msg}`)
    }
    e.reply = async (msg) => {
        logger.info(`reply 回复内容 ${msg}`)
        if (msg.type == 'image') {
            const fileName = `${uuidv4()}.jpg`
            const filePath = `./data/server/${fileName}`
            fs.writeFile(filePath, msg.file, "binary")
            data.push({ 'type': 'image', 'value': fileName })
        } else {
            // msg is string
            data.push({ 'type': 'text', 'value': msg })
        }
    }

    await PluginsLoader.deal(e)

    return { 'code': 0, 'msg': "success", 'data': data }
})

fastify.listen({ port: 8080 }, (err, address) => {
    if (err) throw err
})