const { LinValidator, Rule } = require('../../core/lin-validator')

//创建留言
class CreateMessageValidator extends LinValidator {
    constructor() {
        super()
        this.nickname = [
                new Rule('isOptional'),
                new Rule('isLength', '昵称范围为1~32个字符', {
                    min: 1,
                    max: 32
                })
            ],
            this.content = [
                new Rule('isLength', '内容范围为1~1023个字符', {
                    min: 1,
                    max: 1023
                })
            ]
    }
}

module.exports = {
    CreateMessageValidator
}