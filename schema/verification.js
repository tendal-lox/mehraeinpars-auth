'use strict'

module.exports.generateCode = {
    schema: {
        body: {
            type: 'object',
            properties: {
                number: {type: 'string'}
            }
        },
        response: {
            '200': {
                type: 'object',
                properties: {
                    status: {type: 'boolean'}
                }
            }
        }
    }
}

module.exports.verifyCode = {
    schema: {
        body: {
            type: 'object',
            properties: {
                number: {type: 'string'},
                code: {type: 'string'}
            }
        },
        response: {
            '200': {
                type: 'object',
                properties: {
                    isValid: {type: 'boolean'}
                }
            }
        }
    }
}