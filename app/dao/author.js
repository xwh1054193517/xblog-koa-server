const { Op } = require('sequelize')

const { Author, ArticleAuthor } = require('@models')
const { Forbidden, NotFound, ParameterException } = require('@exception')
const { AuthType } = require('../lib/enums')
const bcrypt = require('bcryptjs')

class AuthorDao {
    // 创建作者
    async createAuthor(item) {
        const name = item.get('body.name')
        const author = await Author.findOne({
            where: {
                name
            }
        })
        if (author) {
            throw new Forbidden({
                msg: '作者已经存在'
            })
        }
        await Author.create({
            name: item.get('body.name'),
            avatar: item.get('body.avatar'),
            email: item.get('body.email'),
            description: item.get('body.description'),
            password: item.get('body.password'),
            auth: item.get('body.auth')
        })
    }

    //获取作者详细信息
    async getAuthorDetail(id) {
        const author = await Author.findOne({
            where: {
                id,
            },
            
        })
        return author
    }

    //更新作者
    async updateAuthor(item, id) {
        const author = await Author.findByPk(id)
        if (!author) {
            throw new NotFound({
                msg: '没有该作者'
            })
        }
        author.avatar = item.get('body.avatar')
        author.email = item.get('body.email')
        author.description = item.get('body.description')
        author.auth = item.get('body.auth')
        author.save()
    }

    //更新头像
    async updateAvatar(avatar, id) {
        const author = await Author.findByPk(id)
        if (!author) {
            throw new NotFound({
                msg: '没有该作者'
            })
        }
        author.avatar = avatar
        author.save()
        return author
    }

    //删除作者
    async deleteAuthor(id) {
        const author = await Author.findOne({
            where: {
                id
            }
        })
        if (!author) {
            throw new NotFound({
                msg: '没有该作者'
            })
        }
        const result = await ArticleAuthor.findOne({
            where: {
                author_id: id
            }
        })
        if (result) {
            throw new Forbidden({
                msg: '该作者有文章，禁止删除'
            })
        }
        author.destroy()
    }

    //超级管理员修改他人的密码
    async changePassword(item, id) {
        const author = await Author.findByPk(id)
        if (!author) {
            throw new NotFound({
                msg: '没有该作者'
            })
        }
        author.password = item.get('body.password')
        author.save()
    }

    //作者修改自己的密码
    async changeSelfPassword(item, id) {
        const author = await Author.findByPk(id)
        if (!author) {
            throw new NotFound({
                msg: '没有该作者'
            })
        }
        const correctPwd = bcrypt.compareSync(item.get('body.oldPassword'), author.password)
        if (!correctPwd) {
            throw new ParameterException('原密码不正确')
        }
        author.password = v.get('body.password')
        author.save()
    }

    //验证密码
    async verifyPassword(ctx, name, password) {
        const author = await Author.findOne({
            where: {
                name
            }
        })
        if (!author) {
            throw new NotFound('作者不存在')
        }
        const correct = bcrypt.compareSync(password, author.password)
        if (!correct) {
            throw new ParameterException('密码不正确')
        }

        return author
    }

    //获得作者
    async getAuthors() {
        const authors = await Author.findAll({})
        return authors
    }

    //获取除了管理员外的全部作者
    async getAdminAuthors() {
        const authors = await Author.findAll({
            where: {
                auth: {
                    [Op.ne]: AuthType.SUPERADMIN
                }
            },
        })
        return authors
    }
}

module.exports = {
    AuthorDao
}