const fs = require('fs');

const { FileDao } = require('@dao/file')
const FileDto = new FileDao()


const { cosConfig } = require("../../config/config")
const COS = require("cos-nodejs-sdk-v5");
var cos = new COS({
    // 必选参数
    SecretId: cosConfig.SecretId,
    SecretKey: cosConfig.SecretKey,
    // 可选参数
    FileParallelLimit: 3, // 控制文件上传并发数
    ChunkParallelLimit: 8, // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
    ChunkSize: 1024 * 1024 * 8, // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
    Proxy: '',
    Protocol: 'http:',
    FollowRedirect: false,
});

class UpLoader {
    constructor(prefix) {
        this.prefix = prefix || null
    }

    
    //获取当前目录下文件的所有Key，无指定目录则所有文件
    getColumnFileKey() {
        return new Promise((resolve, reject) => {
            cos.getBucket({
                Bucket: cosConfig.Bucket,
                /* 必须 */
                Region: cosConfig.Region,
                /* 必须 */
                Prefix: this.prefix,
            }, (err, data) => {
                if (err) { reject(err); return }
                let res = data.Contents
                res = Array.from(res)
                res = res.map(item => item.Key).filter(item => /.*(?<!\/)$/.exec(item))
                resolve(res)
            });
        })
    }

    //上传图片文件
    async putFile(files, prefix, id = 0) {
        if (!files) return { msg: '文件上传出错', errorCode: "400" }
            //单文件
        if (files && !files.length) {
            console.log('进来了单文件');
            const reader = fs.createReadStream(files.filepath)
            let filename = files.originalFilename
            if (prefix === 'content') {
                filename += new Date().getTime()
            }
            const key = prefix + '/' + filename
            return new Promise((resolve, reject) => {
                cos.putObject({
                    Bucket: cosConfig.Bucket,
                    Region: cosConfig.Region,
                    Key: key,
                    Body: reader, // 上传文件对象
                }, (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve({
                            errorCode: data.statusCode,
                            key: key,
                            url: 'https://' + data.Location,
                            pos: id
                        })
                    }
                })
            })
        } else {
            console.log('进来了多文件')
            let promises = []
            let index = 0
            for (let file of files) {
                const reader = fs.createReadStream(file.filepath)
                let filename = file.originalFilename
                let idx = id[index]

                // 上传到腾讯云
                if (prefix === 'content') {
                    filename += new Date().getTime()
                }
                const key = prefix + '/' + filename
                const promise = new Promise((resolve, reject) => {
                    cos.putObject({
                        Bucket: cosConfig.Bucket,
                        Region: cosConfig.Region,
                        Key: key,
                        Body: reader, // 上传文件对象
                    }, (err, data) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve({
                                statuCode: data.statusCode,
                                key: key,
                                url: 'https://' + data.Location,
                                pos: idx
                            })
                        }
                    })
                })
                index++
                promises.push(promise)
            };
            try {
                return Promise.all(promises)
            } catch (error) {
                throw new Error('文件上传失败')
            }
        }
    }





}
module.exports = {
    UpLoader
}