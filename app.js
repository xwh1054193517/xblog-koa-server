require('module-alias/register')

const Koa = require('koa')
const parser = require('koa-bodyparser')
const cors = require('koa2-cors')
const catchError = require('./middleware/exception')
const logger = require('koa-logger')
const InitManager = require('./core/init')
const static = require('koa-static')
const path = require('path')
const koaBody = require('koa-body')
const app = new Koa()
app.use(cors())
app.use(koaBody({
    multipart: true,
    keepExtensions: true,
    formidable: {
        keepExtensions: true,
        multipart: true,
        maxFileSize: 5 * 1024 * 1024 //max size of file
    }
}));
app.use(static(path.join(__dirname, '/static')))
app.use(logger())

app.use(parser())
app.use(catchError)

InitManager.init(app)

app.listen(3000, () => {
    console.log('server is running on port 3000');
})