const { TagDao } = require('@dao/tag')
const Router = require('koa-router')

const tagApi = new Router({
    prefix: '/blog/tag'
})

const TagDto = new TagDao()

// 获取所有标签
tagApi.get('/tags', async(ctx) => {
    const tags = await TagDto.getTag()
    ctx.body = tags
})

module.exports = tagApi