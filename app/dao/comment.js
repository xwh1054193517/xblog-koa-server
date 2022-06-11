const { NotFound } = require('@exception')
const { Comment, Article } = require('@models')

class CommentDao {
    //创建评论
    async createComment(item, articleId) {
        const article = await Article.findByPk(articleId)
        if (!article) {
            throw new NotFound({
                msg: '没找到该文章'
            })
        }
        return await Comment.create({
            nickname: item.get('body.nickname'),
            content: item.get('body.content'),
            article_id: articleId
        })
    }

    //获取某文章的评论
    async getComments(articleId) {
        let comments = await Comment.finAll({
            where: {
                article_id: articleId
            },
            // 根据created_at排序 降序
            order: [
                ['created_at', 'DESC']
            ],
            // 排除掉文章Id属性
            attributes: { exclude: ['article_id', 'ArticleId'] }
        })
        comments.forEach(item => {
            item.setDataValue('created_date', item.created_at)
        })
        return comments
    }

    //删除评论
    async deleteComment(id) {
        const comment = await Comment.findOne({
            where: {
                id
            }
        })
        if (!comment) {
            throw new NotFound({
                msg: '没有相关评论'
            })
        }
        comment.destroy()
    }

    //点赞评论
    async likeComment(id) {
        const comment = await Comment.findByPk(id)
        if (!comment) {
            throw new NotFound({
                msg: '没有相关评论'
            })
        }
        await comment.increment('like', { by: 1 })
    }

    //回复评论
    async replyComment(item, articleId, parentId) {
        const article = await Article.findByPk(articleId)
        if (!article) {
            throw new NotFound({
                msg: '没有找到相关文章'
            })
        }
        //,Sequelize 会自动为我们添加一个 id 的 字段作为主键
        const comment = await Comment.findByPk(parentId)
        if (!comment) {
            throw new NotFound({
                msg: '没有找到相关评论'
            })
        }
        return await Comment.create({
            parent_id: parentId,
            article_id: articleId,
            nickname: item.get('body.nickname'),
            content: item.get('body.content'),
        })
    }
}



module.exports = {
    CommentDao
}