const jwt = require('jsonwebtoken')
const { Author } = require('@models')
const { TokenType } = require('../app/lib/enums')

const { Forbidden, AuthFailed, NotFound, InvalidToken, ExpiredToken, RefreshException } = require('@exception')

//解析请求头
async function parseHeader(ctx, type = TokenType.ACCESS) {
    if (!ctx.header || !ctx.header.authorization) {
        throw new AuthFailed({ msg: '身份认证失败，令牌不正确' })
    }
    const parts = ctx.header.authorization.split(' ')
    if (parts.length === 2) {
        //bearer字段
        const scheme = parts[0]
            //jwt字段
        const token = parts[1]
        if (/^Bearer$/i.test(scheme)) {
            let decode
            try {
                decode = jwt.verify(token, global.config.security.secretKey)
            } catch (error) {
                //需要刷新令牌
                if (error.name === 'TokenExpiredError') {
                    throw new ExpiredToken({ msg: 'token已过期，认证失败' })
                } else {
                    throw new InvalidToken({ msg: '认证失败，令牌失效' })
                }
            }
            if (!decode.type || decode.type !== type) {
                throw new AuthFailed({ msg: '令牌类型错误' })
            }
            if (!decode.scope || decode.scope < ctx.level) {
                throw new Forbidden({ msg: '权限不足' })
            }

            const author = await Author.findByPk(decode.uid)
            if (!author) {
                throw new NotFound({ msg: '没有找到作者' })
            }
            // 把 author 挂在 ctx 上
            ctx.currentAuthor = author

            // 往令牌中保存数据
            ctx.auth = {
                uid: decode.uid,
                scope: decode.scope
            }
        }
    } else {
        throw new AuthFailed()
    }
}


//生成令牌
// * @param {number} uid
// * @param {number} scope
// * @param {TokenType} type 
// * @param {Object} options 

const generateToken = function(uid, scope, type = TokenType.ACCESS, options) {
    const secretKey = global.config.security.secretKey
    const token = jwt.sign({
        uid,
        scope,
        type
    }, secretKey, {
        expiresIn: options.expiresIn
    })
    return token
}


//守卫函数，用户登录即可访问
const loginRequired = async function(ctx, next) {
    if (ctx.request.method !== 'OPTIONS') {
        await parseHeader(ctx, TokenType.ACCESS)
        await next()
    } else {
        await next()
    }
}

// 守卫函数，用户刷新令牌，统一异常

const refreshTokenRequiredWithUnifyException = async function(ctx, next) {
    if (ctx.request.method !== 'OPTIONS') {
        try {
            await parseHeader(ctx, TokenType.REFRESH)
        } catch (e) {
            throw new RefreshException()
        }
        await next()
    } else {
        await next()
    }
}

class Auth {
    constructor(level) {
        this.level = level || 1
    }

    get m() {
        return async(ctx, next) => {
            ctx.level = this.level
            return await loginRequired(ctx, next)
        }
    }
}

class RefreshAuth {
    constructor(level) {
        this.level = level || 1
    }

    get m() {
        return async(ctx, next) => {
            ctx.level = this.level
            return await refreshTokenRequiredWithUnifyException(ctx, next)
        }
    }
}


module.exports = {
    Auth,
    RefreshAuth,
    generateToken
}