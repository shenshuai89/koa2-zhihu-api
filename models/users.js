const {
    Schema,
    model
} = require('mongoose')

const userSchema = new Schema({
    "__v": {
        type: Number,
        select: false
    },
    "name": {
        type: String,
        required: true
    },
    "age": {
        type: Number,
        required: false
    },
    "password": {
        type: String,
        required: true,
        select: false
    },
    "avator_url": {
        type: String,
        required: false,
        select: false
    },
    "gender": {
        type: String,
        enum: ['male', 'female'],
        default: 'male',
        required: true
    },
    "headline": {
        type: String
    },
    "locations": {
        type: [{
            type: String,
            select: false
        }]
    },
    "business": {
        type: String,
        select: false
    },
    "employments": {
        type: [{
            company: {
                type: String
            },
            job: {
                type: String
            }
        }],
        select: false
    },
    "educations": {
        type: [{
            school: {
                type: String
            },
            major: {
                type: String
            },
            diploma: {
                type: Number,
                enum: [1, 2, 3, 4, 5]
            },
            entrance_year: {
                type: Number
            },
            graduation_year: {
                type: Number
            }
        }],
        select: false
    },
    // 粉丝列表
    following:{
        // 引用，设置关联到用户
        type: [{ type: Schema.Types.ObjectId, ref: "User"}],
        select: false
    }
})

module.exports = model("User", userSchema)