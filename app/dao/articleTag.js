//操作符运算
const { Op } = require('sequelize')
const { Tag, ArticleTag } = require('@models')

class ArticleTagDao {

    //创建标签
    async createArticleTag(articleId, tags, options = {}) {
        const arr = typeof tags === 'string' ? JSON.parse(tags) : tags
        for (let i = 0; i < arr.length; i++) {
            await ArticleTag.create({
                article_id: articleId,
                tag_id: arr[i]
            }, {...options })
        }
    }

    //查询标签
    async getArticleTag(articleId) {
        const result = await ArticleTag.findAll({
                where: {
                    article_id: articleId
                }
            })
            //找到文章所有的tagid
        let ids = result.map(item => item.tag_id)
        return await Tag.findAll({
            where: {
                id: {
                    //在Ids里面的Id对应的数据表项都会返回
                    [Op.in]: ids
                }
            }
        })
    }

    //根据标签查询文章id
    async getArticleIds(tagId) {
        const result = await ArticleTag.findAll({
            where: {
                tag_id: tagId
            }
        })
        return result.map(item => item.article_id)
    }

    //删除文章的标签
    async deleteArticleTag(articleId, tags = []) {
        const result = await ArticleTag.findAll({
                where: {
                    article_id: articleId
                }
            })
            // 如果 id 相同则不再需要删除
        if (tags.length && result.map(item => item.tag_id).join('') === tags.join('')) {
            return false
        } else {
            for (let i = 0; i < result.length; i++) {
                await result[i].destroy()
            }
            return true
        }
    }
}


module.exports = {
    ArticleTagDao
}