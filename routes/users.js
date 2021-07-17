const Router = require("koa-router");
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("koa-jwt");
const {findUser, createUser,findUserById, updateUser, deleteUser, login, followingList, followersList, follow, unfollow} = require("../controllers/users")
const router = new Router({prefix:"/users"})

// 自定义编写认证中间件
const auth = async (ctx, next) =>{
    const {authorization = ""} = ctx.request.header;
    const token = authorization.replace("Bearer ", "")
    try{
        const user = jsonwebtoken.verify(token, "secret_zidingyi_y8e42938");
        // 将用户信息存储
        ctx.state.user = user;
    }catch(err){
        ctx.throw(401, err.message)
    }
    await next();
}

// 授权，设置权限
// 检查是否有操作数据的权限
const checkOwner=async (ctx, next)=>{
    console.log(ctx)
    if(ctx.params.id !== ctx.state.user._id){
        ctx.throw(403, '没有权限')
    }
    await next();
}

const jwtAuth = jwt({secret:"secret_zidingyi_y8e42938"})



// 查询用户列表 
router.get('/', findUser)
// 新建用户
router.post('/', createUser)
// 查询用户
router.get('/:id', findUserById)
// 更新用户信息
router.put('/:id', jwtAuth, checkOwner, updateUser)
// 删除用户
router.delete('/:id', jwtAuth, checkOwner, deleteUser)
// 用户登录
router.post("/login", login)

//获取我关注的人列表
router.get('/:id/following', followingList)
// 获取我的粉丝列表
router.get('/:id/followers', followersList)

// 关注某人
router.put("/following/:id", jwtAuth, follow);
// 取消关注某人
router.delete("/following/:id", jwtAuth, unfollow)

module.exports = router;