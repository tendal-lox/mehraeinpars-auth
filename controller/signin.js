'use strict'

const schema = require('../schema/authentication');
const bcrypt = require('bcrypt');

module.exports = async (fastify, username) => {

    fastify.post('/signin', {schema: schema.signin}, async (req, reply) => {
        const {username, password} = req.body
        const { redis } = fastify

        const db = await fastify.mongo.db.collection('members')
        const userData = await db.findOne({username: username})
        const hashPass = userData.hash
        const user_name = userData.username

        redis.set('username', user_name, (err) => {
            reply.send(err || { status: 'ok' })
        })

        const verify = bcrypt.compareSync(password, hashPass)

        if (userData && verify) {
            const token = fastify.jwt.sign({username, password})
            return token
        }else{
            return new Error('error happen')
        }
    })
}