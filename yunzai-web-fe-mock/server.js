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

fastify.post('/api/chat', async (request, reply) => {
    reply.type('application/json').code(200)

    let e = request.body

    let data = []

    data = [{ 'type': 'text', 'value': 'your uid' }]

    return { 'code': 0, 'msg': "success", 'data': data }
})

fastify.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
})