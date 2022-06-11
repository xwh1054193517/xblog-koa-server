const Router = require('koa-router')
const { PaginateValidator } = require('@validator/common')
const { MessageDao } = require('@dao/message')
const { CreateMessageValidator } = require('@validator/message')
const { success } = require('../../lib/successhelper')
const MessageDto = new MessageDao()
const messageApi = new Router({
    prefix: '/blog/message'
})


//创建留言
messageApi.post('/', async(ctx) => {
    const item = await new CreateMessageValidator().validate(ctx)
    await MessageDto.createMessage(item)
    success('新建留言成功')
})


//获取所有留言信息
messageApi.get('/messages', async(ctx) => {
    const item = await new PaginateValidator().validate(ctx)
    const { rows, total } = await MessageDto.getMessages(item)
    ctx.body = {
        result: rows,
        total: total
    }
})

module.exports = messageApi