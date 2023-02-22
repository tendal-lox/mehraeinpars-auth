'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')
require('dotenv').config()
const swaggerschema = require('./schema/swagger')

module.exports.options = {}

module.exports = async function (fastify, opts) {

  fastify.register(require('@fastify/redis'), {
    host: process.env.redisHost,
    password: process.env.redisPass,
    port: process.env.redisPort,
    family: process.env.redisFamily
  })

  fastify.register(require('@fastify/mongodb'), {
    forceClose: true,
    url: process.env.url
  })

  fastify.decorate("authenticate", async (req, reply) => {
    try {
      await req.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  fastify.decorate('authRole', async (req, reply) => {
    const { redis } = fastify

    const db = await fastify.mongo.db.collection('members')
    const adminCheckResult = await db.findOne({role: 'admin'})
    const adminRole = adminCheckResult.username

    const userId = await redis.get('username')

    if (adminRole !== userId) {
      reply.send(new Error('you cannot access to this page'))
    }
  })

  fastify.register(require('@fastify/jwt'), {secret: process.env.secret})

  await fastify.register(require('@fastify/swagger'), {swagger: swaggerschema.schema})

  await fastify.register(require('@fastify/swagger-ui'), swaggerschema.schema_ui)
  
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'controller'),
    options: Object.assign({}, opts)
  })
}
