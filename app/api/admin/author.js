const Router = require('koa-router')

const { success } = require('../../lib/successhelper')
const { CreateAuthorValidator, UpdateAuthorValidator, LoginValidator, PasswordValidator, SelfPasswordValidator, AvatarUpdateValidator } = require('@validator/author')
const { PositiveIntegerValidator } = require('@validator/common')
const { Auth, RefreshAuth, generateToken } = require('../../../middleware/auth')
const { getSafeParamId } = require('../../lib/util')
const { Forbidden } = require('@exception')
const { TokenType } = require('../../lib/enums')

const { AuthorDao } = require('@dao/author')
const { ArticleAuthorDao } = require('@dao/articleAuthor')

const AuthorDto = new AuthorDao()
const ArticleAuthorDto = new ArticleAuthorDao()

const authorApi = new Router({
    prefix: '/admin/author'
})


//创建作者
authorApi.post('/', new Auth().m, async(ctx) => {
    const item = await new CreateAuthorValidator().validate(ctx)
    await AuthorDto.createAuthor(item)
    success('创建作者成功')
})

//更新作者信息
authorApi.put('/info', new Auth().m, async(ctx) => {
    const item = await new UpdateAuthorValidator().validate(ctx)
    const id = getSafeParamId(item)
    await AuthorDto.updateAuthor(item, id)
    success('更新成功')
})


// 修改用户头像
authorApi.put('/avatar', new Auth().m, async(ctx) => {
    const item = await new AvatarUpdateValidator().validate(ctx)
    const avatar = item.get('body.avatar')
    const id = ctx.currentAuthor.id
    await AuthorDto.updateAvatar(avatar, id)
    success('更新头像成功')
})


// 超级管理员修改作者的密码
authorApi.put('/password', new Auth(16).m, async(ctx) => {
    const item = await new PasswordValidator().validate(ctx)
    const id = getSafeParamId(item)
    await AuthorDto.changePassword(item, id)
    success('修改作者密码成功')
})

// 修改自己的密码
authorApi.put('/password/self', new Auth().m, new Auth().m, async(ctx) => {
    const item = await new SelfPasswordValidator().validate(ctx)
    const id = ctx.currentAuthor.id

    await AuthorDto.changeSelfPassword(item, id)
    success('修改密码成功')
})

// 删除作者，需要最高权限 才能删除
authorApi.delete('/', new Auth(16).m, async(ctx) => {
    const item = await new PositiveIntegerValidator().validate(ctx)
    const id = getSafeParamId(item)

    const authorId = ctx.currentAuthor.id
    if (id === authorId) {
        throw new Forbidden({
            msg: '不能删除自己'
        })
    }
    await AuthorDto.deleteAuthor(id)
    success('删除作者成功')
})


// 获取除了管理员之外的全部作者
authorApi.get('/authors/admin', new Auth().m, async(ctx) => {
    const authors = await AuthorDto.getAdminAuthors()
    ctx.body = authors
})

// 获取全部作者
authorApi.get('/authors', new Auth().m, async(ctx) => {
    const authors = await AuthorDto.getAuthors()
    ctx.body = authors
})

authorApi.get('/info', new Auth().m, async(ctx) => {
    ctx.body = ctx.currentAuthor
})


// 登录
authorApi.post('/login', async(ctx) => {
    const item = await new LoginValidator().validate(ctx)
    const name = item.get('body.username')
    const password = item.get('body.password')

    const author = await AuthorDto.verifyPassword(ctx, name, password)

    const accessToken = generateToken(author.id, author.auth, TokenType.ACCESS, { expiresIn: global.config.security.accessExp })
    const refreshToken = generateToken(author.id, author.auth, TokenType.REFRESH, { expiresIn: global.config.security.refreshExp })
    ctx.body = {
        accessToken,
        refreshToken
    }
})

/**
 * 守卫函数，用户刷新令牌，统一异常
 */
authorApi.get('/refresh', new RefreshAuth().m, async(ctx) => {
    const author = ctx.currentAuthor

    const accessToken = generateToken(author.id, author.auth, TokenType.ACCESS, { expiresIn: global.config.security.accessExp })
    const refreshToken = generateToken(author.id, author.auth, TokenType.REFRESH, { expiresIn: global.config.security.refreshExp })

    ctx.body = {
        accessToken,
        refreshToken
    }
})

module.exports = authorApi