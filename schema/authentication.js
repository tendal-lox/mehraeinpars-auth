'use strict'

module.exports.signin = {
    body: {
        type: 'object',
        properties: {
            username: {type: 'string'},
            password: {type: 'string'}
        }
    },
    required: ['username', 'password']
}

module.exports.signup = {
    body: {
        type: 'object',
        properties: {
            username: {type: 'string'},
            password: {type: 'string'},
            role: {type: 'string'}
        }
    }
}