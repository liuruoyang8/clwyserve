const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
//引入环境变量包
require('dotenv').config();
const adminAuth = require('./middlewares/admin-auth');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const userAuth = require('./middlewares/user-auth');
//文章列表接口
const articlesAdminRouter=require('./routes/admin/articles');
//分类列表
const adminCategoriesRouter = require('./routes/admin/categories');
//系统设置接口
const adminSettingsRouter = require('./routes/admin/settings');
//用户登陆 接口
const adminUsersRouter = require('./routes/admin/users');
//课程接口，课程数据表关联和依赖课程分类表和用户表
const adminCoursesRouter = require('./routes/admin/courses');
// 章节接口
const adminChaptersRouter = require('./routes/admin/chapters');
//查用户性别
const adminChartsRouter = require('./routes/admin/charts');
//用户登陆
const adminAuthRouter = require('./routes/admin/auth');
// const userAuth = require('./middlewares/user-auth');
// 前端展示分类接口
const categoriesRouter = require('./routes/categories');
// 前端展示课程接口
const coursesRouter = require('./routes/courses');
// 前端章节接口
const chaptersRouter = require('./routes/chapters');
// 前端文章接口
const articlesRouter = require('./routes/articles');
// 前端系统信息接口
const settingsRouter = require('./routes/settings');
// 前端搜索接口
const searchRouter = require('./routes/search');
// 前端注册接口
const authRouter = require('./routes/auth');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ...


app.use(function(req,res,next){
    // req:表示请求对象
    // res:表示响应对象
    // next:表示下一步
    // *：通配符
    res.setHeader('Access-Control-Allow-Origin','*')//允许哪些域名请求我
    res.setHeader('Access-Control-Request-Methods','GET,POST,PUT,DELETE,OPTIONS')//允许哪些请求方式可以请求我
    res.setHeader('Access-Control-Allow-Headers','x-requested-with,content-type')//允许携带哪些请求头信息
    
    // **************上面的代码一写那么就等于这个服务器开启了跨域资源共享
    next()
})
//中间件配置
app.use('/users', userAuth, usersRouter);
// 后台路由配置
app.use('/admin/articles', adminAuth, articlesAdminRouter);
app.use('/admin/categories', adminAuth, adminCategoriesRouter);
app.use('/admin/settings', adminAuth, adminSettingsRouter);
app.use('/admin/users', adminAuth, adminUsersRouter);
app.use('/admin/courses', adminAuth, adminCoursesRouter);
app.use('/admin/chapters', adminAuth, adminChaptersRouter);
app.use('/admin/charts', adminAuth, adminChartsRouter);
//中间件配置
app.use('/admin/auth', adminAuthRouter);
//前端展示路由
app.use('/chapters', chaptersRouter);
app.use('/courses', coursesRouter);
app.use('/articles', articlesRouter);
app.use('/settings', settingsRouter);
app.use('/search', searchRouter);
app.use('/categories', categoriesRouter);
app.use('/', indexRouter);
app.use('/auth', authRouter);

module.exports = app;
