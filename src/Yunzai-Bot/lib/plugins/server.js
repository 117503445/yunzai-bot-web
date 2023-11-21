import path from 'path';
import * as fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid';

import '../config/init.js'
import PluginsLoader from '../plugins/loader.js'

import Fastify from 'fastify'
import * as fstatic from '@fastify/static'
import cors from '@fastify/cors'

import basicAuth from '@fastify/basic-auth'

fs.mkdir('./web-data/images', { recursive: true })

let multiUser = false
let users = {}

try {
    const text = await fs.readFile('./web-data/config.json');
    const cfg = JSON.parse(text);
    multiUser = cfg['multiUser']
    users = cfg['users']
    logger.info('cfg: ', cfg)
} catch (e) {
    logger.info('read config failed, error: ', e)
}


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
    root: __dirname + '/web-data',
    prefix: '/',
})


const authenticate = { realm: 'YunzaiBotWeb' }
fastify.register(basicAuth, { validate, authenticate })
function validate(username, password, req, reply, done) {
    if (!multiUser) {
        done()
    } else {
        let user = users[username]
        if (!user) {
            done(new Error("auth failed, user not found"))
        } else {
            if (user["password"] === password) {
                req.headers["qq"] = users[username]["qq"]
                done()
            } else {
                done(new Error("auth failed, wrong password"))
            }
        }
    }
}
fastify.after(() => {
    fastify.addHook('onRequest', fastify.basicAuth)


    fastify.post('/api/chat-process', async (request, reply) => {
        let qq = 805475874
        if (request.headers['qq']) {
            qq = request.headers['qq']
        }

        let prompt = request.body.prompt
        logger.info('prompt = ', prompt)
        logger.info('qq = ', qq)
        let e = {
            "test": true,
            "self_id": 10000,
            "time": 1676913595310,
            "post_type": "message",
            "message_type": "private",
            "sub_type": "normal",
            "group_id": 826198224,
            "group_name": "测试群",
            "user_id": qq,
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
                "user_id": qq,
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
                const filePath = `./web-data/images/${fileName}`
                
                if (msg.file instanceof Buffer) {
                    fs.writeFile(filePath, msg.file, "binary")
                } else if (typeof msg.file == 'string') {
                    if (msg.file.startsWith('file://')) {
                        // msg.file example file://./data/strategy/1/胡桃.jpg
                        const localFilePath = msg.file.replace(/^file:\/\//, '')
                        fs.copyFile(localFilePath, filePath)
                    } else if (msg.file.startsWith('base64://')) {
                        fs.writeFile(filePath, Buffer.from(msg.file.replace(/^base64:\/\//, 'base64'), ), "binary")
                    } else {
                        logger.error(`unsupported string file: ${msg.file}`)
                    }
                } else {
                    logger.error(`unsupported image type: ${typeof msg.file}`)
                }
                
                data += `![img](images/${fileName})\n`
            } else if (typeof msg == 'string') {
                data += `${msg}\n`
            } else {
                logger.error(`unsupported msg: ${msg}`)
            }
        }

        await PluginsLoader.deal(e)

        if (data == "") {
            await new Promise(r => setTimeout(r, 2000)); // sleep 2s
            if (data == "") {
                data = "机器人似乎没有给出回复 :("
            }
        }

        let response = "{}\n" + JSON.stringify({ "text": data })

        logger.info('response = ', response)
        reply.type('application/json').code(200)

        return response
    })


})

fastify.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
})
