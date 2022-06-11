const { File } = require('@models')
const { NotFound, Forbidden } = require('@exception')
class FileDao {
    //上传文件插入数据到数据库
    async uploadFile(item) {
      const file = await File.findOne({
        where: {
            key: item.key
        }
    })
    if (file) {
        throw new Forbidden({
            msg: '文件已存在'
        })
      }
        return await File.create({
            key: item.key,
            url: item.url,
            type: item.type
        })
    }

    //获取所有文件
    async getAllFiles() {
        const file = await File.findAll()
        return file
    }

    //根据类型获取文件
    async getFilebyId(id) {
        const file = await File.findByPk(id)
        if (file) {
            throw new NotFound({
                msg: '没有相关文件'
            })
        }
        return file
    }


    //更新文件
    async updateFile(id,item) {
            const file = await Category.findOne({
              where: {
                  key: key
              }
          })
            if (!file) {
              throw new NotFound({
                  msg: '没有相关文件'
              })
          }
            file.key = item.key
            file.url = item.url
            file.save()
        }


        //判断有没有数据
    async hasFile(key) {
        const file = await File.findOne({
            where: {
                key: key
            }
        })
        if (!file) {
            return false
        } else {
            return true
        }
    }

    //删除文件
    async deleteFile(key){
      const file = await File.findOne({
        where: {
            key:key
        }
    })
    if (!file) {
        throw new NotFound({
            msg: '没有相关文件'
        })
    }
    return file
  }
}
module.exports = {
    FileDao
}