const Router = require('koa-router')

const { Auth } = require('../../../middleware/auth')
const { CreateOrUpdateFriendValidator } = require('@validator/blog')
const { PositiveIntegerValidator } = require('@validator/common')

const { getSafeParamId } = require('../../lib/util')
const { success } = require('../../lib/successhelper')

const { BlogDao } = require('@dao/blog')

const blogApi = new Router({
    prefix: '/admin/blog'
})

const blogDto = new BlogDao()

// 获取友链
blogApi.get('/friend/friends', new Auth().m, async(ctx) => {
    const friends = await blogDto.getFriends()
    ctx.body = friends
})

// 添加友链
blogApi.post('/friend', new Auth().m, async(ctx) => {
    const item = await new CreateOrUpdateFriendValidator().validate(ctx)
    await blogDto.createFriend(item)
    success('新建友链成功')
})

// 修改友链
blogApi.put('/friend', new Auth().m, async(ctx) => {
    const item = await new CreateOrUpdateFriendValidator().validate(ctx)
    const id = getSafeParamId(item)
    await blogDto.updateFriend(item, id)
    success('修改友链成功')
})

// 删除友链
blogApi.delete('/friend', new Auth(16).m, async(ctx) => {
    const item = await new PositiveIntegerValidator().validate(ctx)
    const id = item.get('query.id')
    await blogDto.deleteFriend(id)
    success('删除标签成功')
})

module.exports = blogApi