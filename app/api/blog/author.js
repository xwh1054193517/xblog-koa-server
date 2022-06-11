const Router = require('koa-router')

const { PositiveIntegerValidator } = require('@validator/common')
const { AuthorDao } = require('@dao/author')
const AuthorDto = new AuthorDao()

const authorApi = new Router({
    prefix: '/blog/author'
})

//获取某个作者详细信息
authorApi.get('/details', async(ctx) => {
    const item = await new PositiveIntegerValidator().validate(ctx)
    const id = item.get('query.id')

    const author = await AuthorDto.getAuthorDetail(id)
    ctx.body = author
})


//获取全部作者
authorApi.get('/authors', async(ctx) => {
    const authors = await AuthorDto.getAuthors()
    ctx.body = authors
})

module.exports = authorApi