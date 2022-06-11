const Router = require('koa-router')

const { PositiveIntegerValidator } = require('@validator/common')
const {
    CreateCommentValidator,
    GetArticlesValidator,
    ReplyCommentValidator,
    SearchArticlesValidator,
} = require('@validator/article')
const { success } = require('../../lib/successhelper')


const { ArticleDao } = require('@dao/article')
const { CommentDao } = require('@dao/comment')

const articleApi = new Router({
    prefix: '/blog/article'
})

const ArticleDto = new ArticleDao()
const CommentDto = new CommentDao()


//获取文章详情
articleApi.get('/', async(ctx) => {
    const item = await new PositiveIntegerValidator().validate(ctx)
    const article = await ArticleDto.getArticle(item.get('query.id'))
    ctx.body = article
})


//点赞文章
articleApi.put('/like', async(ctx) => {
    const item = await new PositiveIntegerValidator().validate(ctx)
    const id = item.get('query.id')
    await ArticleDto.likeArticle(id)
    success('点赞成功')
})

//获取全部文章
articleApi.get('/articles', async(ctx) => {
    // 文章必须是公开的 1 公开 2 私密
    ctx.query.publicId = 1
        // 文章必须是已发布的 1 已发布 2 草稿
    ctx.query.statusId = 1
        // 文章包括非精选和精选
    ctx.query.starId = '0'
    const item = await new GetArticlesValidator().validate(ctx)
    const result = await ArticleDto.getArticles(item)
    ctx.body = result
})


//搜索文章
articleApi.get('/search/articles', async(ctx) => {
    const item = await new SearchArticlesValidator().validate(ctx)
    const result = await ArticleDto.searchArticles(item)
    ctx.body = result
})

// 获取总历史记录
articleApi.get('/archive', async(ctx) => {
    const archive = await ArticleDto.getArchive()
    ctx.body = archive
})

// 获取所有精选文章
articleApi.get('/star/articles', async(ctx) => {
    const articles = await ArticleDto.getStarArticles()
    ctx.body = articles
})


// 添加评论
articleApi.post('/add/comment', async(ctx) => {
    const item = await new CreateCommentValidator().validate(ctx, {
        id: 'articleId'
    })
    const articleId = item.get('body.articleId')
    await CommentDto.createComment(item, articleId)
    success('添加评论成功')
})


// 获取文章下的全部评论
articleApi.get('/get/comment', async(ctx) => {
    const item = await new PositiveIntegerValidator().validate(ctx, {
        id: 'articleId'
    })
    const articleId = item.get('query.articleId')
    const comments = await CommentDto.getComments(articleId)
    ctx.body = comments
})


// 点赞某条评论
articleApi.put('/like/comment', async(ctx) => {
    const item = await new PositiveIntegerValidator().validate(ctx)
    const id = item.get('body.id')
    await CommentDto.likeComment(id)
    success('点赞评论成功')
})


// 回复某条评论
articleApi.post('/reply/comment', async(ctx) => {
    const item = await new ReplyCommentValidator().validate(ctx, {
        id: 'articleId'
    })
    const articleId = item.get('body.articleId')
    const parentId = item.get('body.parentId')
    await CommentDto.replyComment(item, articleId, parentId)
    success('回复成功')
})

module.exports=articleApi