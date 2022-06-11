const { NotFound, Forbidden } = require('@exception')
const { Friend } = require('@models')

class BlogDao {
    // 创建友链
    async createFriend(item) {
        const friend = await Friend.findOne({
            where: {
                name: item.get('body.name')
            }
        })
        if (friend) {
            throw new Forbidden({
                msg: '已经存在该友链'
            })
        }
        return await Friend.create({
            name: item.get('body.name'),
            link: item.get('body.link'),
            avatar: item.get('body.avatar')
        })
    }

    // 修改友链
    async updateFriend(item, id) {
        const friend = await Friend.findByPk(id)
        if (!friend) {
            throw new NotFound({
                msg: '没有找到相关友链'
            })
        }
        friend.name = item.get('body.name'),
            friend.link = item.get('body.link'),
            friend.avatar = item.get('body.avatar')
        friend.save()
    }

    // 获取所有友链
    async getFriends() {
        const friends = Friend.findAll()
        return friends
    }

    // 删除友链
    async deleteFriend(id) {
        const friend = await Friend.findOne({
            where: {
                id
            }
        })
        if (!friend) {
            throw new NotFound({
                msg: '没有找到相关友链'
            })
        }
        friend.destroy()
    }
}

module.exports = {
    BlogDao
}