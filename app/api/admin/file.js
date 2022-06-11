const Router = require('koa-router')
const { UpLoader } = require('../../lib/upload')
const { Auth } = require('../../../middleware/auth')
const fs = require('fs')
const {success} =require('../../lib/successhelper')
const { FileDao } = require('@dao/file')
const FileDto = new FileDao()
const fileApi = new Router({
    prefix: '/admin/file'
})

// 上传文件
fileApi.post('/', async(ctx) => {
    let file = ctx.request.files.files;
    const prefix = ctx.request.body.type;
    const id = ctx.request.body.ID || null;
    const loader = new UpLoader(`${prefix}/`)
    const hasFile=await FileDto.hasFile(`${prefix}/${file.originalFilename}`)
   if(hasFile) {ctx.body={errorCode:403,msg:'文件已存在'}; return}
    const res = await loader.putFile(file, prefix, id)
    const item={key:res.key,url:res.url,type:prefix}
    if(prefix!=='content')
   { const dbRes=await FileDto.uploadFile(item)
    success(dbRes)}
    else success(res)
})

fileApi.put('/', async(ctx) => {
    let file = ctx.request.files.files
    const prefix = ctx.request.body.type;
    const loader = new UpLoader(`${prefix}/`)

    //存到本地
    const filename = file.originalFilename
    const hasFile = await FileDto.hasFile(`${prefix}/${filename}`)
    console.log(`${prefix}/${filename}`);
    console.log(hasFile);
    if (!hasFile) {
        ctx.body = {
            msg: "文件不存在,无法更新",
            errorCode: 403
        }
        return
    }
    //上传到腾讯云
    const res = await loader.putFile(file, prefix)
    const item = { key: res.key, url: res.url }
    console.log(item);

    ctx.body = {
        errorCode: 0,
        msg: res
    }

  
})
fileApi.delete('/', async(ctx) =>{
  const key=ctx.request.query
  console.log(key.key);
 await FileDto.deleteFile(key.key)
  success("删除文件成功")
})
fileApi.post('/articles', async(ctx) => {
  let file = ctx.request.files.files;
  const prefix = ctx.request.body.type;
  const loader = new UpLoader(`${prefix}/`)
  const res = await loader.putFile(file, prefix)
  ctx.body=res
 
  
})



module.exports = fileApi