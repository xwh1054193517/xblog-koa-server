const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const bcrypt = require('bcryptjs')
const { AuthType } = require('../lib/enums')


class Author extends Model {
    toJSON() {
        let origin = {
            id: this.id,
            name: this.name,
            avatar: this.avatar,
            email: this.email,
            description: this.description,
            auth: this.auth
        }
        return origin
    }
}


Author.init({
    name: {
        type: Sequelize.STRING(32),
        allowNull: false
    },
    avatar: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: '',
    },
    email: {
        type: Sequelize.STRING(320),
        allowNull: false
    },
    description: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    //身份等级
    auth: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: AuthType.USER
    },
    //密码要加密处理
    password: {
        type: Sequelize.STRING(127),
        allowNull: false,
        set(origin) {
            //次数越高越安全
            const salt = bcrypt.genSaltSync(10)
            const pwd = bcrypt.hashSync(origin, salt)
            this.setDataValue('password', pwd)
        },
        get() {
            return this.getDataValue('password')
        }
    }
}, {
    sequelize,
    tableName: 'author'
})

module.exports = {
    Author
}