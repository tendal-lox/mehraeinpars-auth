'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/admin', {
    onRequest: [fastify.authenticate],
    preValidation: [fastify.authRole],
  }, async function (req, reply ) {
    return 'welcome to admin page'
  })
}