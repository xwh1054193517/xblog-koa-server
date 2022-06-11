const { Article } = require('./article')
const { ArticleAuthor } = require('./articleAuthor')
const { ArticleTag } = require('./articleTag')
const { Author } = require('./author')
const { Category } = require('./category')
const { Comment } = require('./comment')
const { Message } = require('./message')
const { Tag } = require('./tag')
const { Friend } = require('./friend')
const { File }=require('./file')
// 关联文章和评论 在Comment中加入articleId
Article.hasMany(Comment, {
    as: 'comments',
    constraints: false,
})

Category.belongsTo(File,{
  foreignKey:'file_id',
  as:'file',
  constraints:false,
})

// 关联文章和分类  在Article中加入category_id
Article.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category',
    constraints: false,
})

// 关联文章和作者 在ArticleAuthor表中添加外键article_id连接到article表
Article.belongsToMany(Author, {
    through: {
        model: ArticleAuthor,
        unique: false
    },
    foreignKey: 'article_id',
    constraints: false,
    as: 'authors'
})

// 在ArticleAuthor表中添加外键author_id连接到author表
Author.belongsToMany(Article, {
    through: {
        model: ArticleAuthor,
        unique: false
    },
    foreignKey: 'author_id',
    constraints: false
})

// 关联文章和标签 在ArticleTag表中添加外键article_id连接到article表
Article.belongsToMany(Tag, {
    through: {
        model: ArticleTag,
        unique: false
    },
    foreignKey: 'article_id',
    constraints: false,
    as: 'tags'
})

// 在ArticleTag表中添加外键tag_id连接到tag表
Tag.belongsToMany(Article, {
    through: {
        model: ArticleTag,
        unique: false
    },
    foreignKey: 'tag_id',
    constraints: false
})

module.exports = {
    Article,
    ArticleAuthor,
    ArticleTag,
    Author,
    Category,
    Comment,
    Message,
    Tag,
    Friend,
    File
}