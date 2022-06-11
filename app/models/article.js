// 文章model层，对应数据库的表

const { sequelize } = require('../../core/db')
const { Sequelize, Model } = require('sequelize')

class Article extends Model {}

//文章表
Article.init({
    // 在这里定义模型属性
    //文章标题
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    //文章内容
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    cover: {
        type: Sequelize.STRING(255),
        defaultValue: ''
    },
    //描述简介
    description: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    //分类ID
    category_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    //创建日期
    created_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    //是否公开
    public: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    //状态
    status: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    //喜欢
    like: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    //是否为精选
    star: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    //查看数
    views: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    // 这是其他模型参数
    sequelize, // 我们需要传递连接实例
    modelName: 'article' // 我们需要选择模型名称
});

module.exports = {
    Article
}