const { Sequelize, Model } = require('sequelize')
const { unset, clone, isArray } = require('lodash')
const {
    dbName,
    host,
    port,
    user,
    password,
    logging,
    timezone
} = require('../config/config').database

//封装连接mysql数据库的对象
const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging,
    timezone,
    define: {
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        scopes: {
            bh: {
                attributes: {
                    exclude: ['updated_at', 'deleted_at', 'created_at']
                },
            },
            frontShow: {
                where: {
                    public: 1,
                    status: 1
                }
            }
        }
    }
})

//不重新创建表
sequelize.sync({
    force: false
})

//全局序列化 对数据库返回的数据进行JSON处理修改
Model.prototype.toJSON = function() {
    let data = clone(this.dataValues)
    unset(data, 'updated_at')
    unset(data, 'created_at')
    unset(data, 'deleted_at')

    if (isArray(this.exclude)) {
        this.exclude.forEach(value => {
            unset(data, value)
        })
    }
    return data
}

module.exports = {
    sequelize
}