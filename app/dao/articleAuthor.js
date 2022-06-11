const { Op } = require('sequelize')

const { Author, ArticleAuthor } = require('@models')


class ArticleAuthorDao {
    //创建文章作者
    async createArticleAuthor(articleId, authors, options) {
            const arr = typeof authors === 'string' ? JSON.parse(authors) : authors
            for (let i = 0; i < arr.length; i++) {
                await ArticleAuthor.create({
                    article_id: articleId,
                    author_id: arr[i]
                }, {...options })
            }
        }
        // 获取文章作者
    async getArticleAuthor(articleId, options = {}) {
            const result = await ArticleAuthor.findAll({
                where: {
                    article_id: articleId
                }
            })
            let ids = result.map(item => item.author_id)
            return await Author.findAll({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                },
                ...options
            })
        }
        // 根据作者查询文章id
    async getArticleIds(authorId) {
            const result = await ArticleAuthor.findAll({
                where: {
                    author_id: authorId
                }
            })
            return result.map(item => item.article_id)
        }
        // 删除文章作者

    async deleteArticleAuthor(articleId, authors = []) {
        const result = await ArticleAuthor.findAll({
                where: {
                    article_id: articleId
                }
            })
            //完全相同就不删，否则都删，后面还需要创建
            // 如果 id 相同则不再需要删除

        if (authors.length && result.map(item => item.author_id).join('') === authors.join('')) {
            return false
        } else {
            for (let i = 0; i < result.length; i++) {
                await result[i].destroy()
            }
            return true
        }
    }
}

module.exports = { ArticleAuthorDao }