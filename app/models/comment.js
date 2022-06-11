const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Comment extends Model {

}

Comment.init({
    //回复的评论的iD
    parent_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    nickname: {
        type: Sequelize.STRING(32),
        allowNull: false
    },
    content: {
        type: Sequelize.STRING(1023),
        allowNull: false
    },
    like: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    article_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'comment'
})

module.exports = {
    Comment
}