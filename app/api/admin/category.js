const Router = require('koa-router')

const { CreateOrUpdateCategoryValidator } = require('@validator/category')
const { PositiveIntegerValidator } = require('@validator/common')
const { success } = require('../../lib/successhelper')
const { getSafeParamId } = require('../../lib/util')
const { Auth } = require('../../../middleware/auth')

const { CategoryDao } = require('@dao/category')

const categoryApi = new Router({
    prefix: '/admin/category'
})

const CategoryDto = new CategoryDao()

// 获取所有分类
categoryApi.get('/categories', new Auth().m, async(ctx) => {
    const categories = await CategoryDto.getCategories()
    ctx.body = categories
})


//创建分类
categoryApi.post('/', new Auth().m, async(ctx) => {
    const item = await new CreateOrUpdateCategoryValidator().validate(ctx)
    await CategoryDto.createCategory(item)
    success('新建分类成功')
})


//更新分类
categoryApi.put('/', new Auth().m, async(ctx) => {
    const item = await new CreateOrUpdateCategoryValidator().validate(ctx)
    const id = getSafeParamId(item)
    await CategoryDto.updateCategory(item, id)
    success('更新分类成功')
})

// 删除分类 需要最高权限才能删除分诶
categoryApi.delete('/', new Auth(16).m, async(ctx) => {
    const item = await new PositiveIntegerValidator().validate(ctx)
    const id = item.get('query.id')
    await CategoryDto.deleteCategory(id)
    success('删除分类成功')
})

module.exports = categoryApi