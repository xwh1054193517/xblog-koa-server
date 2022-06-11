module.exports = {
  enviroment: 'dev',
  database: {
      dbName: 'xblog',
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      logging: false,
      timezone: '+08:00'
  },
  paginate: {
      pageDefault: 0, // 默认页码
      countDefault: 10 // 默认一页的数量
  },
  // JWT
  security: {
      // secretKey为自己需要的散列字符
      secretKey: 'xuwenhao',
       // accessExp: Token令牌过期
      accessExp: 60*60, // 1h
      // refreshExp 设置refresh_token的过期时间
      refreshExp: 60*60*24*7
  },
  // 文件上传
  file: {
      singleLimit: 1024 * 1024 * 5, // 单个文件大小限制
      totalLimit: 1024 * 1024 * 20, // 多个文件大小限制
      count: 10, // 单次最大上传数量
      exclude: [] // 禁止上传格式
          // include:[]
  },
   // 腾讯云存储相关配置
    cosConfig: {
    SecretId: 'XXX',
    SecretKey: 'XXX',
    Bucket: 'XXX',
    Region: 'XXX',
    }, host: 'xxx'
}