const Koa = require('koa');
const path = require('path');
const app = new Koa();
const mongoose = require('mongoose')
const parameter = require('koa-parameter');
var bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')
// 设置静态目录z中间件
const koaStatic = require('koa-static');
const routes = require('./routes')
const {connectionPath} = require('./config')

// 设置静态目录
app.use(koaStatic(path.join(__dirname, '/public')))
// 解析 application/json
// app.use(bodyParser()); 
// 使用koa-body替换bodyParser，koa-body可以解析文件格式
app.use(koaBody({
    multipart: true,
    formidable:{
        uploadDir: path.join(__dirname, "/public/uploads"), //设置上传路径
        keepExtensions: true, // 保留扩展名
    }
}))
mongoose.connect(connectionPath, { useNewUrlParser: true, useUnifiedTopology: true}, () =>{
    console.log('connect success')
})
mongoose.connection.on('error',(err)=>{
    console.error("link error",err)
})
parameter(app);

app.use(async (ctx,next) => {
    try {
        await next();
    }catch (err){
        ctx.status = err.status || err.statusCode || 500;
        ctx.body = {
            message: err.message
        };
    }
})


routes(app)
app.listen(3000)