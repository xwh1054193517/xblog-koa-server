// 枚举属性
function isThisType(val) {
    for (let key in this) {
        if (this[key] === val) {
            return true
        }
    }
    return false
}

//身份权限
const AuthType = {
    USER: 4,
    ADMIN: 8,
    SUPERADMIN: 16,
    isThisType
}

//登录Token类型
const TokenType = {
    ACCESS: 'access',
    REFRESH: 'refresh'
}


module.exports = {
    AuthType,
    TokenType
}