'use strict'

const schema = require('../schema/authentication');
const bcrypt = require('bcrypt');

module.exports = async (fastify) => {
    fastify.post('/signup', {schema: schema.signup}, async (req, reply) => {
        const {username, password, role} = req.body

        const hash = bcrypt.hashSync(password, 10);

        const db = await fastify.mongo.db.collection('members')
        const existUser = await db.findOne({username: username})

        if (!existUser) {
            await db.insert({username, hash, role})
            return `welcome ${username}`
        }else {
            return 'You are already singned up'
        }
    })
}