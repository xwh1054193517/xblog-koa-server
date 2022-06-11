const Router = require('koa-router')

const { PositiveIntegerValidator, PaginateValidator } = require('@validator/common')
const { success } = require('../../lib/successhelper')
const { Auth } = require('../../../middleware/auth')
const { MessageDao } = require('@dao/message')

const MessageDto = new MessageDao()

const messageApi = new Router({
    prefix: '/admin/message'
})

//获取所有留言
messageApi.get('/messages', new Auth().m, async(ctx) => {
    const item = await new PaginateValidator().validate(ctx)
    const { rows, total } = await MessageDto.getMessages(item)
    ctx.body = {
        result: rows,
        total: total
    }
})

//删除留言，需要最高权限
messageApi.delete('/', new Auth(16).m, async(ctx) => {
    const item = await new PositiveIntegerValidator().validate(ctx)
    const id = item.get('query.id')
    await MessageDto.deleteMessage(id)
    success('删除成功')
})

module.exports = messageApi