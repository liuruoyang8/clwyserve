const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const { Op } = require('sequelize');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');
//验证密码包
const bcrypt = require('bcryptjs');
//引入token包
const jwt = require('jsonwebtoken');
/**
 * 管理员登录
 * POST /admin/auth/sign_in
 */
router.post('/sign_in', async (req, res) => {
  const { login, password } = req.body;
  const condition = {
    where: {
      [Op.or]: [
        { email: login },
        { username: login }
      ]
    }
  };
  try {
    // 通过email或username，查询用户是否存在
    const user = await User.findOne(condition);
    const token=jwt.sign({
      userId: user.id
    },process.env.SECRET,{ expiresIn: '30d' })

    if (!user) {
      throw new NotFoundError('用户不存在，无法登录。');
    }
    if(!login) {
        throw new BadRequestError('邮箱/用户名必须填写。');
    }
    
    if(!password) {
        throw new BadRequestError('密码必须填写。');
    }
    // 验证密码
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    // console.log(isPasswordValid,'isPasswordValid');
    if (!isPasswordValid) {
        throw new UnauthorizedError('密码错误。');
    }
    
    success(res, '登录成功。', {token});
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;
