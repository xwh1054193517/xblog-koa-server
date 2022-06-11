const { NotFound, Forbidden } = require('@exception')
const { Category, Article } = require('@models')

class CategoryDao {
    async createCategory(item) {
        const category = await Category.findOne({
            where: {
                name: item.get('body.name')
            }
        })
        if (category) {
            throw new Forbidden({
                msg: '分类已存在'
            })
        }
        return await Category.create({
            name: item.get('body.name'),
            cover: item.get('body.cover'),
            description: item.get('body.description')
        })
    }

    async getCategory(id, options = {}) {
        const category = await Category.findOne({
            where: {
                id
            },
            ...options
        })
        return category
    }

    async getCategories() {
        const categories = await Category.findAll()
        return categories
    }

    async updateCategory(item, id) {
        const category = await Category.findByPk(id)
        if (!category) {
            throw new NotFound({
                msg: '没有找到相关分类'
            })
        }
        category.name = item.get('body.name')
        category.description = item.get('body.description')
        category.cover = item.get('body.cover')
        category.save()
    }

    async deleteCategory(id) {
        const category = await Category.findOne({
            where: {
                id
            }
        })
        if (!category) {
            throw new NotFound({
                msg: '没有找到相关分类'
            })
        }
        const article = await Article.findOne({
            where: {
                category_id: id
            }
        })
        if (article) {
            throw new Forbidden({
                msg: '该分类下有文章，禁止删除'
            })
        }
        category.destroy()
    }
}

module.exports = {
    CategoryDao
}