const User = require('../models/users');
const jsonwebtoken = require("jsonwebtoken");

class UsersCtrl {
    async findUser(ctx) {
        ctx.body = await User.find()
    }
    async findUserById(ctx) {
        // 通过?拼接要显示的字段
        const {fileds} = ctx.query;
        // 格式化处理查询字段
        const selectFileds = fileds.split(";").filter(f => f).map(x=> " +"+ x).join("");
        // 通过select查询显示的字段
        const user = await User.findById(ctx.params.id).select(selectFileds)
        if (!user) {
            ctx.throw(404, "User not found")
        }
        ctx.body = user;
    }
    async createUser(ctx) {
        // ctx.body = "创建用户"
        // console.log(ctx.request.body)
        // 创建用户前先验证是否存在该用户
        const {
            name
        } = ctx.request.body;
        const repeatUser = await User.findOne({
            name: name
        });
        // 409表示存在冲突
        if (repeatUser) {
            ctx.throw(409, "用户已经存在")
        }

        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }
    async updateUser(ctx) {
        ctx.verifyParams({
            name: {
                type: "string",
                required: false
            },
            password: {
                type: "string",
                required: false
            },
            avatar: {
                type: "string",
                required: false
            },
            gender: {
                type: "string",
                required: false
            },
            headline: {
                type: "string",
                required: false
            },
            business: {
                type: "string",
                required: false
            },
            locations: {
                type: "array",
                itemType: 'string',
                required: false
            },
            employments: {
                type: "array",
                itemType: 'object',
                required: false
            },
            educations: {
                type: "array",
                itemType: 'object',
                required: false
            },
        })
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!user) {
            ctx.throw(404, 'User not found');
        }
        ctx.body = {
            message: "更新成功"
        };
    }
    async deleteUser(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id)
        if (!user) {
            ctx.throw(404, 'User not found');
        }
        ctx.body = {
            message: "删除成功"
        }
        // ctx.status = 204;
    }
    async login(ctx) {
        // ctx.request.body name和password必须填写
        ctx.verifyParams({
            name: {
                type: "string",
                required: true
            },
            password: {
                type: "string",
                required: true
            }
        })
        const user = await User.findOne(ctx.request.body);
        if (!user) {
            ctx.throw(401, '用户名或密码有误');
        }
        const {
            _id,
            name
        } = user;
        // 设置jsonwebtoken
        const token = jsonwebtoken.sign({
            _id,
            name
        }, "secret_zidingyi_y8e42938", {
            expiresIn: "1d"
        });
        ctx.body = {
            token
        }

    }
    // 获取关注者的列表
    async followingList(ctx) {
        // 使用populate方法，需要在定义schema时设置ref关联对象
        const user = await User.findById(ctx.params.id).select("+following").populate("following")
        if(!user){
            ctx.throw(404)
        }else{
            ctx.body = user.following;
        }
    }
    // 获取粉丝列表
    async followersList(ctx){
        // 通过查询所有用户，选出用户中关注者包含有登录者id的人，则这些人都是粉丝
        const followers = await User.find({following: ctx.params.id});
        // 返回粉丝列表
        ctx.body = followers
    }
    // 关注别人
    async follow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        // 如果想要关注的人的id不在following中，才进行关注操作，否则不做处理
        if(!me.following.map(id=> id.toString()).includes(ctx.params.id)){
            me.following.push(ctx.params.id)
            // save才能保存到数据库
            me.save();
        }
        ctx.status = 204;
    }
    // 取消关注
    async unfollow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
        if(index > -1){
            // 关注者列表中存在，就把该id的人从关注者中移除
            me.following.splice(index, 1)
            // save才能保存到数据库
            me.save();
        }
        ctx.status = 204;        
    }
}

module.exports = new UsersCtrl();