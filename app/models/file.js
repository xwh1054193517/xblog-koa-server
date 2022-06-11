// 文件model层，对应数据库的表

const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class File extends Model {
    toJSON() {
        let origin = {
            id: this.id,
            key: this.key,
            url: this.url,
            type: this.type
        }
        return origin
    }
}

//文件表
File.init({
    // 在这里定义模型属性
    //文件key
    key: {
        type: Sequelize.STRING,
        defaultValue: ''
    },
    //文件url
    url: {
        type: Sequelize.STRING,
        defaultValue: ''
    },

    type: {
        type: Sequelize.STRING,
        defaultValue: ''
    }
}, {
    // 这是其他模型参数
    sequelize, // 我们需要传递连接实例
    modelName: 'file' // 我们需要选择模型名称
});

module.exports = {
    File
}