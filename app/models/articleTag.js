const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')
class ArticleTag extends Model {

}

// 文章ID 标签类型ID表
ArticleTag.init({
    article_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'articleTag'
})

module.exports = {
    ArticleTag
}