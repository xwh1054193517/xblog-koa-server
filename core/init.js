const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
    static init(app) {
        InitManager.app = app
        InitManager.initLoadRoutes()
        InitManager.initloadConfig()
    }

    //自动注册路由
    static initLoadRoutes() {
        const appDirectory = `${process.cwd()}/app/api`
        requireDirectory(module, appDirectory, {
            visit: (obj) => {
                if (obj instanceof Router) {
                    InitManager.app.use(obj.routes());
                }
            }
        })
    }

    //自动导入设置文件
    static initloadConfig(path = '') {
        const configPath = path || process.cwd() + '/config/config.js'
        const config = require(configPath)
            //挂载到顶层对象
        global.config = config
    }
}

//导出初始化设置
module.exports = InitManager