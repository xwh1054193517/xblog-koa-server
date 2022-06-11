const { LinValidator, Rule } = require('../../core/lin-validator')

//创建或更新分类
class CreateOrUpdateFileValidator extends LinValidator {
    constructor() {
        super()
        this.key = [
            new Rule('isLength', '分类名必须在1~64个字符之间', {
                min: 1,
                max: 64
            })
        ]
        this.url = [
            new Rule('isURL', '不符合URL规范')
        ]
        this.type=[
          new Rule('isLength', '类型不正确', {
            min: 1,
            max: 64
        })
        ]
    }
}

module.exports = {
    CreateOrUpdateFileValidator
}