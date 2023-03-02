import path from 'path';
import * as fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid';

import Fastify from 'fastify'
import * as fstatic from '@fastify/static'
import cors from '@fastify/cors'

fs.mkdir('./data/server/images', { recursive: true })

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

fastify.post('/chat-process', async (request, reply) => {
    reply.type('application/json').code(200)

    let e = request.body

    let data = []

    data = [{ 'type': 'text', 'value': 'your uid' }]

    // return {"role":"assistant","id":"cmpl-6pTTfBQfIODHnOy6JXgWvQtUQEoqe","parentMessageId":"f4e0df4b-fbac-4d97-bb65-5fcbc6ac6b72","conversationId":"6a4f5063-f0a9-4f42-85f5-1af1341e63f8","text":"\n你好，有什么可以帮助你？","detail":{"id":"cmpl-6pTTfBQfIODHnOy6JXgWvQtUQEoqe","object":"text_completion","created":1677726059,"choices":[{"text":"？","index":0,"logprobs":null,"finish_reason":null}],"model":"text-davinci-003"}}
    return `{}
    {"text":"hello ![img](https://sunlanchang.github.io/images/biaozhunfenleiIPdizhi.png)"}`
})

fastify.listen({ port: 3002, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
})