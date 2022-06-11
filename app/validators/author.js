const { LinValidator, Rule } = require('../../core/lin-validator')
const { AuthType } = require('../lib/enums')

//更新作者信息
class UpdateAuthorValidator extends LinValidator {
    constructor() {
        super()
        this.email = [
            new Rule('isEmail', '不符合Email规范')
        ]
        this.avatar = [
                new Rule('isURL', '不符合URL规范')
            ],
            this.description = [
                new Rule('isLength', '描述长度为1~255个字符', {
                    min: 1,
                    max: 255
                })
            ]
        this.validateAuth = checkAuth
    }
}


//创建作者
class CreateAuthorValidator extends UpdateAuthorValidator {
    constructor() {
        super()
        this.name = [
            new Rule('isLength', '昵称长度为4~32个字符', {
                min: 4,
                max: 32
            })
        ]
        this.password = [
            new Rule('isLength', '密码长度为6~32个字符', {
                min: 6,
                max: 32
            }),
            new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
        ]
    }
}

//验证密码长度
class PasswordValidator extends LinValidator {
    constructor() {
        super()
        this.password = [
            new Rule('isLength', '密码长度为6~32个字符', {
                min: 6,
                max: 32
            }),
            new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
        ]
    }
}

//使用正则验证密码规范
class SelfPasswordValidator extends PasswordValidator {
    constructor() {
        super()
        this.oldPassword = [
            new Rule('isLength', '密码长度为6~32个字符', {
                min: 6,
                max: 32
            }),
            new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
        ]
    }
}

// 登录验证不能为空
class LoginValidator extends LinValidator {
    constructor() {
        super()
        this.nickname = new Rule('isNotEmpty', '昵称不可为空');
        this.password = new Rule('isNotEmpty', '密码不可为空');
    }
}

//头像更新验证
class AvatarUpdateValidator extends LinValidator {
    constructor() {
        super()
        this.avatar = new Rule('isNotEmpty', '必须传入头像的url链接');
    }
}

//验证等级
function checkAuth(val) {
    let auth = val.body.auth
    if (!auth) {
        throw new Error('auth是必须参数')
    }
    auth = parseInt(auth)
    if (!AuthType.isThisType(auth)) {
        throw new Error('auth参数不合法')
    }
}


module.exports = {
    SelfPasswordValidator,
    CreateAuthorValidator,
    LoginValidator,
    UpdateAuthorValidator,
    PasswordValidator,
    AvatarUpdateValidator
}