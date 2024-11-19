const { Article } = require('../models');

/**
 * 公共方法：查询当前文章
 */
async function getArticle(req) {
    // 获取文章 ID
   const { id } = req.params;
 
    // 查询当前文章
   const article = await Article.findByPk(id);
 
   // 如果没有找到，就抛出异常
   if (!article) {
     throw new NotFoundError(`ID: ${ id }的文章未找到。`)
   }
 
   return article;
 }
 /**
 * 请求成功
 * @param res 
 * @param message 请求成功后的消息str
 * @param data 返回给前端的数据
 * @param code 状态码
 */
function success(res, message, data = {}, code = 200) {
    res.status(code).json({
      status: true,
      message,
      ...data
    });
  }
  function failure(res, error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(e => e.message);
      return res.status(400).json({
        status: false,
        message: '请求参数错误',
        errors
      });
    }
  
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        status: false,
        message: '资源不存在',
        errors: [error.message]
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: false,
        message: '认证失败',
        errors: ['您提交的 token 错误。']
      });
    }
  
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: false,
        message: '认证失败',
        errors: ['您的 token 已过期。']
      });
    }
    res.status(500).json({
      status: false,
      message: '服务器错误',
      errors: [error.message]
    });
  }
 module.exports={
    success,
    getArticle,
    failure
}