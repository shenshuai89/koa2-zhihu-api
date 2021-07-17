const path = require("path")

class HomeCtrl{
    index(ctx){
        ctx.body = "这是首页page"
    }
    upload(ctx){
        const file = ctx.request.files.file;
        const basename = path.basename(file.path)
        ctx.body = {
            url: `${ctx.origin}/uploads/${basename}`
        }
    }
}

module.exports = new HomeCtrl();