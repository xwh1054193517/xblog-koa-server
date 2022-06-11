const Router = require('koa-router')

const { PositiveIntegerValidator } = require('@validator/common')
const { CategoryDao } = require('@dao/category')

const categoryApi = new Router({
    prefix: '/blog/category'
})

const CategoryDto = new CategoryDao()

// 获取所有分类
categoryApi.get('/categories', async(ctx) => {
    const categories = await CategoryDto.getCategories()
    ctx.body = categories
})

// 获取分类详情
categoryApi.get('/', async(ctx) => {
    const item = await new PositiveIntegerValidator().validate(ctx)
    const id = item.get('query.id')
    const category = await CategoryDto.getCategory(id)
    ctx.body = category
})

module.exports = categoryApi