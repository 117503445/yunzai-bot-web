import path from 'path';
import * as fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid';

import '../config/init.js'
import PluginsLoader from '../plugins/loader.js'

import Fastify from 'fastify'
import * as fstatic from '@fastify/static'
import cors from '@fastify/cors'

fs.mkdir('./data/server/images', { recursive: true })

global.Bot = {}
await PluginsLoader.load()

const fastify = Fastify({
    logger: true
})

fastify.register(cors, {
    origin: true,
})

const __dirname = path.resolve();
fastify.register(fstatic, {
    root: __dirname + '/data/server',
    prefix: '/',
})

fastify.post('/api/chat-process', async (request, reply) => {
    reply.type('application/json').code(200)

    let prompt = request.body.prompt
    logger.info('prompt = ', prompt)
    let e = {
        "test": true,
        "self_id": 10000,
        "time": 1676913595310,
        "post_type": "message",
        "message_type": "friend",
        "sub_type": "normal",
        "group_id": 826198224,
        "group_name": "测试群",
        "user_id": 805475874,
        "anonymous": null,
        "message": [
            {
                "type": "text",
                "text": prompt
            }
        ],
        "raw_message": "#uid",
        "font": "微软雅黑",
        "sender": {
            "user_id": 805475874,
            "nickname": "测试",
            "card": "this_is_card",
            "sex": "male",
            "age": 0,
            "area": "unknown",
            "level": 2,
            "role": "owner",
            "title": ""
        },
        "group": {
            "mute_left": 0
        },
        "friend": {},
        "message_id": "JzHU0DACliIAAAD3RzTh1WBOIC48"
    }

    let data = ""

    e.group.sendMsg = (msg) => {
        logger.info(`group 回复内容 = ${msg}`)
    }
    e.reply = async (msg) => {
        logger.info(`reply 回复内容 = ${msg}`)
        if (msg.type == 'image') {
            const fileName = `${uuidv4()}.jpg`
            const filePath = `./data/server/images/${fileName}`
            fs.writeFile(filePath, msg.file, "binary")
            data += `![img](images/${fileName})\n`
        } else if (typeof msg == 'string') {
            data += `${msg}\n`
        } else {
            logger.error(`unsupported msg: ${msg}`)
        }
    }

    await PluginsLoader.deal(e)

    if(data == ""){
        await new Promise(r => setTimeout(r, 2000)); // sleep 2s
        if(data == ""){
            data = "机器人似乎没有给出回复 :("
        }
    }

    let response ="{}\n"+ JSON.stringify({"text": data})
    
    logger.info('response = ', response)
    return response
})

fastify.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
})