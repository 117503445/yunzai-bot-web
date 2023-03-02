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

    return `{}
    {"text":"hello ![img](https://sunlanchang.github.io/images/biaozhunfenleiIPdizhi.png)"}`
})

fastify.post('/config', async (request, reply) => {
    reply.type('application/json').code(200)

    return {"message":null,"data":{"apiModel":"","reverseProxy":"","timeoutMs":0,"socksProxy":"-"},"status":"Success"}
})

fastify.listen({ port: 3002, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
})