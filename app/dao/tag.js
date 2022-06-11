const { NotFound, Forbidden } = require('@exception')
const { Tag, ArticleTag } = require('@models')

class TagDao {
    //创建标签 管理员用
    async createTag(item) {
        const tag = await Tag.findOne({
            where: {
                name: item.get('body.name')
            }
        })
        if (tag) {
            throw new Forbidden({
                msg: '该标签已经存在'
            })
        }
        return await Tag.create({
            name: item.get('body.name')
        })
    }

    //根据id获取标签
    async getTag(id) {
        const tag = Tag.findOne({
            where: {
                id
            }
        })
        return tag
    }

    //获取所有标签
    async getTag() {
        const tags = Tag.findAll()
        return tags
    }

    //更新标签
    async updateTag(item, id) {
        const tag = await Tag.findByPk(id)
        if (!tag) {
            throw new NotFound({
                msg: '没找到该标签'
            })
        }
        tag.name = item.get('body.name')
        tag.save()
    }

    //删除标签
    async deleteTag(id) {
        const tag = await Tag.findOne({
            where: {
                id
            }
        })
        if (!tag) {
            throw new NotFound({
                msg: '没有找到相关标签'
            })
        }
        const result = await ArticleTag.findOne({
            where: {
                tag_id: id
            }
        })
        if (result) {
            throw new Forbidden({
                msg: '该标签下有文章，禁止删除'
            })
        }
        tag.destroy()
    }
}

module.exports = {
    TagDao
}