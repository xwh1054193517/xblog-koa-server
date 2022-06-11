# 个人博客管理后台项目

## 使用nodejs+koa+mysql进行服务端开发

### 主要功能：
* 管理员登录
* 上传文件（腾讯云存储）
* 文章管理
* 作者管理
* 分类管理
* 标签管理
* 留言管理
* 友链管理
* 数据监控（待开发）
* 音乐管理（待开发）

### 具体实现
  1. 集成JWT的后台生成Token+refreshToken的无感刷新
  2. 使用Sequelize框架以对象形式在Mysql中创建数据表
  3. 使用腾讯云存储的对象存储将文件放在云空间
  4. 使用Validator的二次封装Lin-validator进行参数验证
  5. 使用原生的文件流操作实现单、多文件上传功能
  6. 优化、重构接口

### 使用方法
1. 安装依赖
```
npm install
```
2. 在config的config.js中配置
```
  //配置数据库设置
    database: {
        dbName: 'xblog',//数据库名词
        host: 'localhost',//数据库地址
        port: 3306,
        user: 'root',//账号
        password: 'root',//密码
        logging: false,
        timezone: '+08:00'
    },
```
```
 //腾讯云存储 详情参考腾讯云
   cosConfig: {
        SecretId: 'xxxx',
        SecretKey: 'xxxx',
        Bucket: 'xxx',
        Region: 'ap-guangzhou',
    },
```
3. 执行命令运行
```
npm run start:dev

//可以使用pm2托管项目

npm run pm2

```