const Router = require('koa-router')

const { BlogDao } = require('@dao/blog')

const blogApi = new Router({
    prefix: '/blog/friend'
})

const blogDto = new BlogDao()

// 获取友链
blogApi.get('/', async(ctx) => {
    const friends = await blogDto.getFriends()
    ctx.body = friends
})

module.exports = blogApi