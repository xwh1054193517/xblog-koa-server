const { toSafeInteger, isInteger } = require('lodash')
const { ParametersException } = require('@exception')


function getSafeParamId(ctx) {
    const id = toSafeInteger(ctx.get('query.id'))
    if (!isInteger(id)) {
        throw new ParametersException({
            msg: '路由参数出错'
        })
    }
    return id
}

module.exports = {
    getSafeParamId
}