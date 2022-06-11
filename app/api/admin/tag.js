const Router = require('koa-router')

const { success } = require('../../lib/successhelper')
const { CreateOrUpdateTagValidator } = require('@validator/tag')
const { getSafeParamId } = require('../../lib/util')
const { PositiveIntegerValidator } = require('@validator/common')
const { Auth } = require('../../../middleware/auth')

const { TagDao } = require('@dao/tag')

const tagApi = new Router({
    prefix: '/admin/tag'
})

const TagDto = new TagDao()

//获得所有标签
tagApi.get('/tags', new Auth().m, async(ctx) => {
    const tags = await TagDto.getTag()
    ctx.body = tags
})

//新建标签
tagApi.post('/', new Auth().m, async(ctx) => {
    const item = await new CreateOrUpdateTagValidator().validate(ctx)
    await TagDto.createTag(item)
    success('新建标签成功')
})


//更新标签
tagApi.put('/', new Auth().m, async(ctx) => {
    const item = await new CreateOrUpdateTagValidator().validate(ctx)
    const id = getSafeParamId(item)
    await TagDto.updateTag(item, id)
    success('更新标签成功')
})

// 删除标签，需要最高权限才能删除留言
tagApi.delete('/', new Auth(16).m, async(ctx) => {
    const item = await new PositiveIntegerValidator().validate(ctx)
    const id = item.get('query.id')
    await TagDto.deleteTag(id)
    success('删除标签成功')
})

module.exports = tagApi