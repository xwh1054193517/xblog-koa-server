const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

// 分类表
class Category extends Model {
    toJSON() {
        let origin = {
            id: this.id,
            name: this.name,
            description: this.description,
            cover: this.cover
        }
        return origin
    }
}

Category.init({
    name: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    description: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    //url?
    cover: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
}, {
    sequelize,
    tableName: 'category'
})

module.exports = {
    Category
}