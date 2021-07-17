const Router = require("koa-router");
const router = new Router()
// 导入控制器
const HomeCtrl = require("../controllers/home")

router.get('/', HomeCtrl.index)

// 上传文件
router.post('/upload', HomeCtrl.upload)

module.exports = router;