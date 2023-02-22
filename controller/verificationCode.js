'use strict'

const {faker} = require('@faker-js/faker')

const schema = require('../schema/verification')

module.exports = async (fastify) => {
    const {redis} = fastify

    fastify.post('/generatecode', schema.generateCode, async (req, reply) => {
        const {number} = req.body
        const existCode = await redis.get(verification(number))

        if (!existCode) {
            const code = faker.random.numeric(6)

            await redis.setnx(verification(number), code)
            redis.expire(verification(number), 20)

            return code
        }
    })

    fastify.post('/verifycode', schema.verifyCode, async (req, reply) => {
        const {number, code} = req.body

        const inputCode = await redis.get(verification(number))
        redis.del(verification(number))

        return {isValid: inputCode === code}
    })

    const verification = (number) => `verification:${number}`
}