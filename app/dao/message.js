const { Message } = require('@models')

class MessageDao {
    async createMessage(item) {
        return await Message.create({
            nickname: item.get('body.nickname'),
            content: item.get('body.content')
        })
    }

    //分页查询
    async getMessages(item) {
        const start = item.get('query.page');
        const pageCount = item.get('query.count');
        //rows为记录，count为数量
        const { rows, count } = await Message.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            offset: start * pageCount,
            limit: pageCount,
        })
        return {
            rows,
            total: count
        }
    }

    async deleteMessage(id) {
        const message = await Message.findOne({
            where: {
                id
            }
        })
        if (!message) {
            throw new NotFound({
                msg: '没有找到相关留言'
            })
        }
        message.destroy()
    }
}

module.exports = {
    MessageDao
}