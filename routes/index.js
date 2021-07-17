const fs = require('fs');
const allRoutes = (app)=>{
    fs.readdirSync(__dirname).forEach(file=>{
        if(!file.includes("index")){
            const route = require(`./${file}`)
            app.use(route.routes()).use(route.allowedMethods())
        }
    })
}
module.exports = allRoutes;